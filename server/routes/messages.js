import { Router } from 'express';
import Message from '../models/Message.js';
import { requireAuth } from '../middleware/auth.js';

const router = Router();

// GET /api/messages/:roomId — load message history (paginated)
router.get('/:roomId', requireAuth, async (req, res) => {
  try {
    const { limit = 50, before } = req.query;
    const filter = { roomId: req.params.roomId };
    if (before) filter.createdAt = { $lt: new Date(before) };

    const messages = await Message.find(filter)
      .populate('sender', 'name avatar role')
      .sort({ createdAt: -1 })
      .limit(Number(limit));

    // Mark messages in this room as read for this user
    await Message.updateMany(
      { roomId: req.params.roomId, sender: { $ne: req.userId }, read: false },
      { read: true }
    );

    res.json(messages.reverse());
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// POST /api/messages — persist a message
router.post('/', requireAuth, async (req, res) => {
  try {
    const { roomId, text } = req.body;
    if (!roomId || !text?.trim()) {
      return res.status(400).json({ error: 'roomId and text are required' });
    }
    const message = await Message.create({ roomId, text: text.trim(), sender: req.userId });
    await message.populate('sender', 'name avatar role');
    res.status(201).json(message);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

export default router;

