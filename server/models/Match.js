import mongoose from 'mongoose';

/**
 * Match — represents a connection request or match between a founder and an investor.
 * When an investor clicks "Connect" on a pitch, a Match is created with status 'pending'.
 * The founder can accept or decline, transitioning to 'matched' or 'rejected'.
 */
const matchSchema = new mongoose.Schema({
  founder: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  investor: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  startup: { type: mongoose.Schema.Types.ObjectId, ref: 'Startup' },
  pitch: { type: mongoose.Schema.Types.ObjectId, ref: 'Pitch' },
  status: {
    type: String,
    enum: ['pending', 'matched', 'rejected', 'withdrawn'],
    default: 'pending',
  },
  initiatedBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  message: String, // optional intro message with the connection request
  roomId: String,  // Socket.io room ID for matched pairs
}, { timestamps: true });

// Ensure one match record per founder-investor pair
matchSchema.index({ founder: 1, investor: 1 }, { unique: true });

export default mongoose.model('Match', matchSchema);
