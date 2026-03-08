import Startup from '../models/Startup.js';

export async function getStartups(req, res) {
  try {
    const { industry, stage, limit = 20, skip = 0 } = req.query;
    const filter = {};
    if (industry && industry !== 'All') filter.industry = industry;
    if (stage && stage !== 'All') filter.stage = stage;
    const startups = await Startup.find(filter).sort({ createdAt: -1 }).limit(Number(limit)).skip(Number(skip));
    res.json(startups);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
}

export async function getStartup(req, res) {
  try {
    const startup = await Startup.findById(req.params.id);
    if (!startup) return res.status(404).json({ error: 'Startup not found' });
    res.json(startup);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
}

export async function createStartup(req, res) {
  try {
    const startup = new Startup(req.body);
    await startup.save();
    res.status(201).json(startup);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
}

export async function updateStartup(req, res) {
  try {
    const startup = await Startup.findByIdAndUpdate(req.params.id, req.body, { new: true });
    if (!startup) return res.status(404).json({ error: 'Startup not found' });
    res.json(startup);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
}

export async function deleteStartup(req, res) {
  try {
    await Startup.findByIdAndDelete(req.params.id);
    res.json({ success: true });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
}

export async function likeStartup(req, res) {
  try {
    const startup = await Startup.findByIdAndUpdate(req.params.id, { $inc: { likes: 1 } }, { new: true });
    if (!startup) return res.status(404).json({ error: 'Startup not found' });
    res.json({ likes: startup.likes });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
}
