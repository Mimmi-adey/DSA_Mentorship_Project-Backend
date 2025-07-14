import AuthModel from '../models/authSchema.js';
import SessionModel from '../models/sessionSchema.js';
import MatchModel from '../models/matchSchema.js';

const getAllUsers = async (req, res) => {
    console.log("Fetching all sessions")
  try {
    const users = await AuthModel.find().select('-password');
    res.status(200).json(users);
  } catch (error) {
    res.status(500).json({ message: 'Failed to fetch users' });
  }
};

const updateUserRole = async (req, res) => {
  try {
    const { id } = req.params;
    const { role } = req.body;
    const updated = await AuthModel.findByIdAndUpdate(id, { role }, { new: true }).select('-password');
    res.status(200).json(updated);
  } catch (error) {
    res.status(500).json({ message: 'Failed to update role' });
  }
};

export const getAllSessions = async (req, res) => {
  try {
    const sessions = await SessionModel.find()
      .populate('mentee', 'fullName email')
      .populate('mentor', 'fullName email')
      .sort({ scheduledDate: -1 });

    res.status(200).json(sessions);
  } catch (error) {
    res.status(500).json({ message: 'Failed to fetch sessions' });
  }
};

// Get all mentorship matches
const getAllMatches = async (req, res) => {
  try {
    const matches = await MatchModel.find()
      .populate('mentee', '-password')
      .populate('mentor', '-password');
    res.status(200).json(matches);
  } catch (error) {
    res.status(500).json({ message: 'Failed to fetch matches' });
  }
};

// Assign a mentor to a mentee request
const assignMentorToMatch = async (req, res) => {
  try {
    const { id } = req.params; // Match ID
    const { mentorId } = req.body;

    const updatedMatch = await MatchModel.findByIdAndUpdate(
      id,
      { mentor: mentorId, status: 'assigned' },
      { new: true }
    ).populate('mentee', '-password')
     .populate('mentor', '-password');

    res.status(200).json(updatedMatch);
  } catch (error) {
    res.status(500).json({ message: 'Failed to assign mentor' });
  }
};


export { getAllUsers, updateUserRole, getAllMatches, assignMentorToMatch };