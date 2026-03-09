import Match from '../models/Match.js';
import Notification from '../models/Notification.js';

export async function createMatch(req, res) {
  try {
    const { founderId, startupId, message } = req.body;
    if (!founderId || !startupId) {
      return res.status(400).json({ error: 'founderId and startupId are required' });
    }

    const existing = await Match.findOne({ founder: founderId, investor: req.userId });
    if (existing) {
      return res.status(409).json({ error: 'Connection request already exists', match: existing });
    }

    const roomId = `match_${[founderId, req.userId].sort().join('_')}`;
    const match = await Match.create({
      founder: founderId,
      investor: req.userId,
      startup: startupId,
      initiatedBy: req.userId,
      message,
      roomId,
      status: 'pending',
    });

    await Notification.create({
      recipient: founderId,
      type: 'match_request',
      from: req.userId,
      startup: startupId,
      match: match._id,
      message: message || 'wants to connect with you',
    });

    const populated = await match.populate([
      { path: 'founder', select: 'name avatar email role' },
      { path: 'investor', select: 'name avatar email role' },
      { path: 'startup', select: 'name tagline industry stage' },
    ]);

    res.status(201).json(populated);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
}

export async function getMatches(req, res) {
  try {
    const { status } = req.query;
    const filter = { $or: [{ founder: req.userId }, { investor: req.userId }] };
    if (status) filter.status = status;

    const matches = await Match.find(filter)
      .populate('founder', 'name avatar email role company')
      .populate('investor', 'name avatar email role company')
      .populate('startup', 'name tagline industry stage thumbnail')
      .sort({ updatedAt: -1 });

    res.json(matches);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
}

export async function updateMatch(req, res) {
  try {
    const { status } = req.body;
    if (!['matched', 'rejected', 'withdrawn'].includes(status)) {
      return res.status(400).json({ error: 'Invalid status' });
    }
    const match = await Match.findById(req.params.id);
    if (!match) return res.status(404).json({ error: 'Match not found' });

    const isInitiator = match.initiatedBy.toString() === req.userId;
    if (isInitiator && status !== 'withdrawn') {
      return res.status(403).json({ error: 'Only the recipient can accept or reject' });
    }
    if (!isInitiator && status === 'withdrawn') {
      return res.status(403).json({ error: 'Only the initiator can withdraw' });
    }

    match.status = status;
    await match.save();

    // Notify the other party
    const notifyUserId = isInitiator ? (match.founder.toString() === req.userId ? match.investor : match.founder) : match.initiatedBy;
    const notifType = status === 'matched' ? 'match_accepted' : status === 'rejected' ? 'match_rejected' : 'match_request';
    await Notification.create({
      recipient: notifyUserId,
      type: notifType,
      from: req.userId,
      match: match._id,
      startup: match.startup,
      message: status === 'matched' ? 'accepted your connection request!' : status === 'rejected' ? 'declined your connection request' : 'withdrew the connection request',
    });

    const populated = await match.populate([
      { path: 'founder', select: 'name avatar email role' },
      { path: 'investor', select: 'name avatar email role' },
      { path: 'startup', select: 'name tagline industry stage' },
    ]);

    res.json(populated);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
}
