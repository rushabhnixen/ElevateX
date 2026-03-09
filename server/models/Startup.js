import mongoose from 'mongoose';

const startupSchema = new mongoose.Schema({
  name: { type: String, required: true },
  tagline: { type: String, required: true },
  description: String,
  industry: { type: String, enum: ['FinTech', 'CleanTech', 'EdTech', 'HealthTech', 'SaaS', 'DeepTech'] },
  stage: { type: String, enum: ['Pre-seed', 'Seed', 'Series A', 'Series B+'] },
  askAmount: String,
  equity: String,
  traction: String,
  videoUrl: String,
  videoPublicId: String,
  thumbnail: String,
  likes: { type: Number, default: 0 },
  comments: { type: Number, default: 0 },
  bookmarks: { type: Number, default: 0 },
  founder: {
    userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
    name: String,
    title: String,
    bio: String,
    avatar: String,
  },
  team: [{ name: String, role: String, avatar: String }],
}, { timestamps: true });

export default mongoose.model('Startup', startupSchema);
