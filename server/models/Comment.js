import mongoose from 'mongoose';

const commentSchema = new mongoose.Schema({
  startup: { type: mongoose.Schema.Types.ObjectId, ref: 'Startup', required: true },
  user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  text: { type: String, required: true, maxlength: 1000 },
  likes: { type: Number, default: 0 },
  likedBy: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }],
}, { timestamps: true });

commentSchema.index({ startup: 1, createdAt: -1 });

export default mongoose.model('Comment', commentSchema);
