import Startup from '../models/Startup.js';
import Comment from '../models/Comment.js';
import Notification from '../models/Notification.js';
import { v2 as cloudinary } from 'cloudinary';
import fs from 'fs';

if (process.env.CLOUDINARY_CLOUD_NAME) {
  cloudinary.config({
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET,
  });
}

// GET /api/startups — public listing of approved startups (or all for admin)
export async function getStartups(req, res) {
  try {
    const { industry, stage, search, status, founder, limit = 20, skip = 0 } = req.query;
    const filter = {};

    // Public users only see approved; admin/founder of own can see others
    if (status && req.userId) {
      filter.status = status;
    } else {
      filter.status = 'approved';
    }

    // Founder can see their own startups regardless of status
    if (founder) {
      filter['founder.userId'] = founder;
      delete filter.status;
    }

    if (industry && industry !== 'All') filter.industry = industry;
    if (stage && stage !== 'All') filter.stage = stage;
    if (search) {
      filter.$text = { $search: search };
    }

    const [startups, total] = await Promise.all([
      Startup.find(filter).sort({ createdAt: -1 }).limit(Number(limit)).skip(Number(skip)),
      Startup.countDocuments(filter),
    ]);
    res.json({ startups, total, hasMore: Number(skip) + startups.length < total });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
}

// GET /api/startups/:id
export async function getStartup(req, res) {
  try {
    const startup = await Startup.findById(req.params.id);
    if (!startup) return res.status(404).json({ error: 'Startup not found' });

    // Track views
    if (req.userId && !startup.viewedBy.includes(req.userId)) {
      startup.viewedBy.push(req.userId);
      startup.views += 1;
      await startup.save();
    }

    res.json(startup);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
}

// POST /api/startups
export async function createStartup(req, res) {
  try {
    const data = { ...req.body };
    data.founder = typeof data.founder === 'string' ? JSON.parse(data.founder) : data.founder || {};
    data.founder.userId = req.userId;
    data.team = typeof data.team === 'string' ? JSON.parse(data.team) : data.team || [];

    if (req.file) {
      if (process.env.CLOUDINARY_CLOUD_NAME) {
        const result = await cloudinary.uploader.upload(req.file.path, {
          resource_type: 'video',
          folder: 'elevatex/pitches',
        });
        data.videoUrl = result.secure_url;
        data.videoPublicId = result.public_id;
        data.thumbnail = result.secure_url.replace('/video/upload/', '/video/upload/so_0/').replace('.mp4', '.jpg');
      } else {
        data.videoUrl = `/uploads/${req.file.filename}`;
      }
      fs.unlink(req.file.path, () => {});
    }

    data.status = 'pending';
    const startup = await Startup.create(data);
    res.status(201).json(startup);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
}

// PUT /api/startups/:id — only founder who owns it can update
export async function updateStartup(req, res) {
  try {
    const startup = await Startup.findById(req.params.id);
    if (!startup) return res.status(404).json({ error: 'Startup not found' });
    if (startup.founder.userId.toString() !== req.userId) {
      return res.status(403).json({ error: 'Not authorized' });
    }
    Object.assign(startup, req.body);
    if (req.body.name || req.body.tagline || req.body.description) {
      startup.status = 'pending'; // Re-submit for review on content changes
    }
    await startup.save();
    res.json(startup);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
}

// DELETE /api/startups/:id — owner only
export async function deleteStartup(req, res) {
  try {
    const startup = await Startup.findById(req.params.id);
    if (!startup) return res.status(404).json({ error: 'Startup not found' });
    if (startup.founder.userId.toString() !== req.userId) {
      return res.status(403).json({ error: 'Not authorized' });
    }
    if (startup.videoPublicId && process.env.CLOUDINARY_CLOUD_NAME) {
      await cloudinary.uploader.destroy(startup.videoPublicId, { resource_type: 'video' });
    }
    await startup.deleteOne();
    res.json({ success: true });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
}

// POST /api/startups/:id/like — toggle like with dedup
export async function likeStartup(req, res) {
  try {
    const startup = await Startup.findById(req.params.id);
    if (!startup) return res.status(404).json({ error: 'Startup not found' });

    const idx = startup.likedBy.indexOf(req.userId);
    if (idx === -1) {
      startup.likedBy.push(req.userId);
      startup.likes += 1;
      // Notify founder
      if (startup.founder.userId.toString() !== req.userId) {
        await Notification.create({
          recipient: startup.founder.userId,
          type: 'like',
          from: req.userId,
          startup: startup._id,
          message: `liked your pitch "${startup.name}"`,
        });
      }
    } else {
      startup.likedBy.splice(idx, 1);
      startup.likes = Math.max(0, startup.likes - 1);
    }
    await startup.save();
    res.json({ likes: startup.likes, liked: idx === -1 });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
}

// POST /api/startups/:id/bookmark — toggle bookmark
export async function bookmarkStartup(req, res) {
  try {
    const startup = await Startup.findById(req.params.id);
    if (!startup) return res.status(404).json({ error: 'Startup not found' });

    const idx = startup.bookmarkedBy.indexOf(req.userId);
    if (idx === -1) {
      startup.bookmarkedBy.push(req.userId);
      startup.bookmarks += 1;
    } else {
      startup.bookmarkedBy.splice(idx, 1);
      startup.bookmarks = Math.max(0, startup.bookmarks - 1);
    }
    await startup.save();
    res.json({ bookmarks: startup.bookmarks, bookmarked: idx === -1 });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
}

// GET /api/startups/:id/comments
export async function getComments(req, res) {
  try {
    const comments = await Comment.find({ startup: req.params.id })
      .populate('user', 'name avatar role')
      .sort({ createdAt: -1 })
      .limit(50);
    res.json(comments);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
}

// POST /api/startups/:id/comments
export async function createComment(req, res) {
  try {
    const { text } = req.body;
    if (!text?.trim()) return res.status(400).json({ error: 'Comment text required' });

    const startup = await Startup.findById(req.params.id);
    if (!startup) return res.status(404).json({ error: 'Startup not found' });

    const comment = await Comment.create({ startup: req.params.id, user: req.userId, text: text.trim() });
    startup.comments += 1;
    await startup.save();

    const populated = await comment.populate('user', 'name avatar role');

    // Notify founder
    if (startup.founder.userId.toString() !== req.userId) {
      await Notification.create({
        recipient: startup.founder.userId,
        type: 'comment',
        from: req.userId,
        startup: startup._id,
        message: `commented on "${startup.name}"`,
      });
    }

    res.status(201).json(populated);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
}

// Admin: review startup
export async function reviewStartup(req, res) {
  try {
    const { status, rejectionReason } = req.body;
    if (!['approved', 'rejected'].includes(status)) {
      return res.status(400).json({ error: 'Status must be approved or rejected' });
    }
    const startup = await Startup.findById(req.params.id);
    if (!startup) return res.status(404).json({ error: 'Startup not found' });

    startup.status = status;
    startup.reviewedBy = req.userId;
    startup.reviewedAt = new Date();
    if (status === 'rejected') startup.rejectionReason = rejectionReason || '';
    await startup.save();

    // Notify founder
    await Notification.create({
      recipient: startup.founder.userId,
      type: status === 'approved' ? 'startup_approved' : 'startup_rejected',
      startup: startup._id,
      message: status === 'approved'
        ? `Your pitch "${startup.name}" has been approved and is now live!`
        : `Your pitch "${startup.name}" was not approved. Reason: ${rejectionReason || 'Does not meet guidelines'}`,
    });

    res.json(startup);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
}

