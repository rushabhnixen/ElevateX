import { Router } from 'express';
import User from '../models/User.js';
import Startup from '../models/Startup.js';
import Notification from '../models/Notification.js';
import { requireAuth } from '../middleware/auth.js';

const router = Router();

// GET /api/users/:id — public profile
router.get('/:id', async (req, res) => {
  try {
    const user = await User.findById(req.params.id).select('-passwordHash');
    if (!user) return res.status(404).json({ error: 'User not found' });
    // Also return their startup count
    const startupCount = await Startup.countDocuments({ 'founder.userId': user._id, status: 'approved' });
    res.json({ ...user.toJSON(), startupCount });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// PUT /api/users/:id — update own profile
router.put('/:id', requireAuth, async (req, res) => {
  try {
    if (req.userId !== req.params.id) {
      return res.status(403).json({ error: 'Forbidden' });
    }
    const allowed = ['name', 'bio', 'headline', 'avatar', 'role', 'company', 'location', 'website', 'linkedin', 'twitter', 'investmentThesis', 'preferredStages', 'preferredIndustries', 'onboardingComplete'];
    const updates = {};
    for (const key of allowed) {
      if (req.body[key] !== undefined) updates[key] = req.body[key];
    }
    const user = await User.findByIdAndUpdate(req.params.id, updates, { new: true, runValidators: true }).select('-passwordHash');
    if (!user) return res.status(404).json({ error: 'User not found' });
    res.json(user);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

// POST /api/users/:id/follow
router.post('/:id/follow', requireAuth, async (req, res) => {
  try {
    const targetId = req.params.id;
    if (req.userId === targetId) {
      return res.status(400).json({ error: 'Cannot follow yourself' });
    }
    const [me, target] = await Promise.all([
      User.findById(req.userId),
      User.findById(targetId),
    ]);
    if (!target) return res.status(404).json({ error: 'User not found' });

    const alreadyFollowing = me.following.includes(targetId);
    if (alreadyFollowing) {
      me.following.pull(targetId);
      target.followers.pull(req.userId);
    } else {
      me.following.addToSet(targetId);
      target.followers.addToSet(req.userId);
      await Notification.create({
        recipient: targetId,
        type: 'follow',
        from: req.userId,
        message: 'started following you',
      });
    }
    await Promise.all([me.save(), target.save()]);
    res.json({ following: !alreadyFollowing, followersCount: target.followers.length });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// GET /api/users/:id/bookmarks
router.get('/:id/bookmarks', requireAuth, async (req, res) => {
  try {
    if (req.userId !== req.params.id) {
      return res.status(403).json({ error: 'Forbidden' });
    }
    const user = await User.findById(req.params.id).populate({
      path: 'bookmarks',
      match: { status: 'approved' },
    });
    if (!user) return res.status(404).json({ error: 'User not found' });
    res.json(user.bookmarks);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// POST /api/users/:id/bookmark/:startupId
router.post('/:id/bookmark/:startupId', requireAuth, async (req, res) => {
  try {
    if (req.userId !== req.params.id) {
      return res.status(403).json({ error: 'Forbidden' });
    }
    const user = await User.findById(req.params.id);
    if (!user) return res.status(404).json({ error: 'User not found' });

    const startupId = req.params.startupId;
    const already = user.bookmarks.includes(startupId);
    if (already) {
      user.bookmarks.pull(startupId);
      await Startup.findByIdAndUpdate(startupId, { $inc: { bookmarks: -1 } });
    } else {
      user.bookmarks.addToSet(startupId);
      await Startup.findByIdAndUpdate(startupId, { $inc: { bookmarks: 1 } });
    }
    await user.save();
    res.json({ bookmarked: !already });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

export default router;

