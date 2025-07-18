import mongoose from 'mongoose';

const matchSchema = new mongoose.Schema({
  mentee: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'users', // match the AuthModel export
    required: true,
  },
  mentor: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'users',
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
}, { timestamps: true });

const MatchModel = mongoose.models.Match || mongoose.model('Match', matchSchema);
export default MatchModel;