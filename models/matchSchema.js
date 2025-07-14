import mongoose from 'mongoose';

const matchSchema = new mongoose.Schema({
  mentee: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Auth',
    required: true,
  },
  mentor: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Auth',
    default: null, // can be null until assigned
  },
  topic: {
    type: String,
    required: true,
  },
  status: {
    type: String,
    enum: ['pending', 'assigned', 'rejected'],
    default: 'pending',
  },
  createdAt: {
    type: Date,
    default: Date.now,
  }
});

const MatchModel = mongoose.model('Match', matchSchema);
export default MatchModel;