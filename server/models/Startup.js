import mongoose from 'mongoose';

const startupSchema = new mongoose.Schema({
  name: { type: String, required: true, trim: true },
  tagline: { type: String, required: true, trim: true },
  description: String,
  industry: { type: String, enum: ['FinTech', 'CleanTech', 'EdTech', 'HealthTech', 'SaaS', 'DeepTech', 'AI/ML', 'Web3', 'BioTech', 'Other'] },
  stage: { type: String, enum: ['Pre-seed', 'Seed', 'Series A', 'Series B+'] },
  askAmount: String,
  equity: String,
  traction: String,
  videoUrl: String,
  videoPublicId: String,
  thumbnail: String,
  pitchDeckUrl: String,
  website: String,
  metrics: {
    revenue: String,
    users: String,
    growth: String,
  },
  status: { type: String, enum: ['draft', 'pending', 'approved', 'rejected'], default: 'pending' },
  rejectionReason: String,
  reviewedBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  reviewedAt: Date,
  likes: { type: Number, default: 0 },
  comments: { type: Number, default: 0 },
  bookmarks: { type: Number, default: 0 },
  views: { type: Number, default: 0 },
  likedBy: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }],
  bookmarkedBy: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }],
  viewedBy: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }],
  founder: {
    userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    name: String,
    title: String,
    bio: String,
    avatar: String,
  },
  team: [{ name: String, role: String, avatar: String }],
}, { timestamps: true });

startupSchema.index({ status: 1, createdAt: -1 });
startupSchema.index({ 'founder.userId': 1 });
startupSchema.index({ industry: 1, stage: 1 });
startupSchema.index({ name: 'text', tagline: 'text', description: 'text' });

export default mongoose.model('Startup', startupSchema);
