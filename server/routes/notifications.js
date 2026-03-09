import { Router } from 'express';
import Notification from '../models/Notification.js';
import { requireAuth } from '../middleware/auth.js';

const router = Router();
router.use(requireAuth);

// GET /api/notifications
router.get('/', async (req, res) => {
  try {
    const notifications = await Notification.find({ recipient: req.userId })
      .populate('from', 'name avatar role')
      .populate('startup', 'name tagline thumbnail')
      .sort({ createdAt: -1 })
      .limit(50);
    const unreadCount = await Notification.countDocuments({ recipient: req.userId, read: false });
    res.json({ notifications, unreadCount });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// PUT /api/notifications/read-all
router.put('/read-all', async (req, res) => {
  try {
    await Notification.updateMany({ recipient: req.userId, read: false }, { read: true });
    res.json({ success: true });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// PUT /api/notifications/:id/read
router.put('/:id/read', async (req, res) => {
  try {
    const notif = await Notification.findOneAndUpdate(
      { _id: req.params.id, recipient: req.userId },
      { read: true },
      { new: true }
    );
    if (!notif) return res.status(404).json({ error: 'Not found' });
    res.json(notif);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

export default router;
