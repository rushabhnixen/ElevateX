import mongoose from 'mongoose';

const notificationSchema = new mongoose.Schema({
  recipient: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  type: { type: String, enum: ['like', 'comment', 'match_request', 'match_accepted', 'match_rejected', 'startup_approved', 'startup_rejected', 'follow', 'message'], required: true },
  from: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  startup: { type: mongoose.Schema.Types.ObjectId, ref: 'Startup' },
  match: { type: mongoose.Schema.Types.ObjectId, ref: 'Match' },
  message: String,
  read: { type: Boolean, default: false },
}, { timestamps: true });

notificationSchema.index({ recipient: 1, read: 1, createdAt: -1 });

export default mongoose.model('Notification', notificationSchema);
