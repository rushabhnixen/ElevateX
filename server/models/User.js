import mongoose from 'mongoose';

const userSchema = new mongoose.Schema({
  name: { type: String, required: true, trim: true },
  email: { type: String, required: true, unique: true, lowercase: true, trim: true },
  passwordHash: { type: String, required: true },
  avatar: String,
  role: { type: String, enum: ['founder', 'investor', 'admin'], default: 'investor' },
  bio: { type: String, maxlength: 500 },
  headline: String,
  company: String,
  location: String,
  website: String,
  linkedin: String,
  twitter: String,
  investmentThesis: String,
  preferredStages: [String],
  preferredIndustries: [String],
  verified: { type: Boolean, default: false },
  following: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }],
  followers: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }],
  bookmarks: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Startup' }],
  onboardingComplete: { type: Boolean, default: false },
}, { timestamps: true });

userSchema.index({ role: 1 });
userSchema.index({ name: 'text', company: 'text', bio: 'text' });

userSchema.set('toJSON', {
  transform(doc, ret) {
    delete ret.passwordHash;
    return ret;
  },
});

export default mongoose.model('User', userSchema);
