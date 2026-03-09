import { Router } from 'express';
import { requireAuth } from '../middleware/auth.js';
import { requireAdmin } from '../middleware/admin.js';
import { reviewStartup } from '../controllers/startupController.js';
import Startup from '../models/Startup.js';
import User from '../models/User.js';
import Match from '../models/Match.js';

const router = Router();
router.use(requireAuth, requireAdmin);

// GET /api/admin/stats
router.get('/stats', async (req, res) => {
  try {
    const [totalUsers, totalStartups, pendingStartups, totalMatches, founders, investors] = await Promise.all([
      User.countDocuments(),
      Startup.countDocuments(),
      Startup.countDocuments({ status: 'pending' }),
      Match.countDocuments(),
      User.countDocuments({ role: 'founder' }),
      User.countDocuments({ role: 'investor' }),
    ]);
    res.json({ totalUsers, totalStartups, pendingStartups, totalMatches, founders, investors });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// GET /api/admin/startups — list startups filtered by status
router.get('/startups', async (req, res) => {
  try {
    const { status = 'pending', limit = 20, skip = 0 } = req.query;
    const filter = {};
    if (status !== 'all') filter.status = status;
    const [startups, total] = await Promise.all([
      Startup.find(filter).sort({ createdAt: -1 }).limit(Number(limit)).skip(Number(skip)),
      Startup.countDocuments(filter),
    ]);
    res.json({ startups, total });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// PUT /api/admin/startups/:id/review — approve/reject
router.put('/startups/:id/review', reviewStartup);

// GET /api/admin/users
router.get('/users', async (req, res) => {
  try {
    const { role, limit = 50, skip = 0 } = req.query;
    const filter = {};
    if (role && role !== 'all') filter.role = role;
    const [users, total] = await Promise.all([
      User.find(filter).select('-passwordHash').sort({ createdAt: -1 }).limit(Number(limit)).skip(Number(skip)),
      User.countDocuments(filter),
    ]);
    res.json({ users, total });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// PUT /api/admin/users/:id — admin can update user (verify, change role, etc.)
router.put('/users/:id', async (req, res) => {
  try {
    const { verified, role } = req.body;
    const updates = {};
    if (typeof verified === 'boolean') updates.verified = verified;
    if (role) updates.role = role;
    const user = await User.findByIdAndUpdate(req.params.id, updates, { new: true }).select('-passwordHash');
    if (!user) return res.status(404).json({ error: 'User not found' });
    res.json(user);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

export default router;
