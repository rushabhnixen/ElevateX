import mongoose from 'mongoose';

const userSchema = new mongoose.Schema({
  clerkId: { type: String, required: true, unique: true },
  name: String,
  email: { type: String, required: true },
  avatar: String,
  role: { type: String, enum: ['founder', 'investor'] },
  bio: String,
  following: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }],
  followers: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }],
  bookmarks: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Startup' }],
}, { timestamps: true });

export default mongoose.model('User', userSchema);
