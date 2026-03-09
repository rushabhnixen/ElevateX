import mongoose from 'mongoose';

/**
 * Pitch — a founder's video pitch associated with a Startup.
 * Tracks video URL, metadata, engagement stats, and moderation state.
 */
const pitchSchema = new mongoose.Schema({
  startup: { type: mongoose.Schema.Types.ObjectId, ref: 'Startup', required: true },
  founder: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  title: { type: String, required: true, maxlength: 100 },
  videoUrl: { type: String, required: true },
  thumbnailUrl: String,
  duration: Number, // seconds
  askAmount: String,
  equity: String,
  stage: { type: String, enum: ['Pre-seed', 'Seed', 'Series A', 'Series B+'] },
  likes: { type: Number, default: 0 },
  comments: { type: Number, default: 0 },
  bookmarks: { type: Number, default: 0 },
  views: { type: Number, default: 0 },
  likedBy: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }],
  status: { type: String, enum: ['pending', 'approved', 'rejected'], default: 'pending' },
}, { timestamps: true });

export default mongoose.model('Pitch', pitchSchema);
