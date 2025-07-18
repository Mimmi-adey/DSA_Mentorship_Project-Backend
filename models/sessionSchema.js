import mongoose from 'mongoose';

const sessionSchema = new mongoose.Schema({
  mentee: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Auth',
    required: true,
  },
  mentor: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Auth',
    required: true,
  },
  match: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Match',
  },
  scheduledDate: {
    type: Date,
    required: true,
  },
  feedback: {
    mentee: { type: String },
    mentor: { type: String },
  },
  status: {
    type: String,
    enum: ['upcoming', 'completed', 'cancelled'],
    default: 'upcoming',
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

const SessionModel = mongoose.models.Session || mongoose.model('Session', sessionSchema);
export default SessionModel;