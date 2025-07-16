import express from 'express';
import { authMiddleware } from '../middleware/authMiddleware.js';
import { adminMiddleware } from '../middleware/adminMiddleware.js';
import {
  getAllUsers,
  updateUserRole,
  getAllSessions,
  getAllMatches,
  assignMentorToMatch
} from '../controller/adminController.js';
import AuthModel from '../models/authSchema.js';
import SessionModel from '../models/sessionSchema.js';

const router = express.Router();

// Admin Dashboard
router.get('/dashboard', authMiddleware, adminMiddleware, (req, res) => {
  res.status(200).json({ message: 'Welcome Admin. This is your dashboard.' });
});

// Get all users
router.get('/users', authMiddleware, adminMiddleware, getAllUsers);

// Update user role
router.put('/users/:id', authMiddleware, adminMiddleware, updateUserRole);

// Pending mentor approvals
router.get('/mentors/pending', authMiddleware, adminMiddleware, async (req, res) => {
  const pendingMentors = await AuthModel.find({ role: 'mentor', status: 'pending' });
  res.json(pendingMentors);
});

// Reports placeholder
router.get('/reports', authMiddleware, adminMiddleware, (req, res) => {
  res.json([{ id: 1, message: 'Inappropriate content reported' }]);
});

// Health check for admin routes
router.get('/test', (req, res) => {
  res.json({ message: 'Admin route is alive!' });
});

// ✅ FINAL versions (only one set of each)
router.get('/matches', authMiddleware, adminMiddleware, getAllMatches);
router.put('/matches/:id', authMiddleware, adminMiddleware, assignMentorToMatch);
router.get('/sessions', authMiddleware, adminMiddleware, getAllSessions);

router.get('/sessions/test', (req, res) => {
  res.json({ message: 'Sessions route reached!' });
});

// Approve mentor
router.put('/mentors/:id/approve', authMiddleware, adminMiddleware, async (req, res) => {
  try {
    const updated = await AuthModel.findByIdAndUpdate(
      req.params.id,
      { status: 'approved' },
      { new: true }
    ).select('-password');
    res.status(200).json(updated);
  } catch (error) {
    res.status(500).json({ message: 'Failed to approve mentor' });
  }
});

// Reject mentor
router.put('/mentors/:id/reject', authMiddleware, adminMiddleware, async (req, res) => {
  try {
    const updated = await AuthModel.findByIdAndUpdate(
      req.params.id,
      { status: 'rejected' },
      { new: true }
    ).select('-password');
    res.status(200).json(updated);
  } catch (error) {
    res.status(500).json({ message: 'Failed to reject mentor' });
  }
});

// Reports/Stats
router.get('/stats', authMiddleware, adminMiddleware, async (req, res) => {
  try {
    const totalUsers = await AuthModel.countDocuments();
    const totalMentors = await AuthModel.countDocuments({ role: 'mentor' });
    const totalMentees = await AuthModel.countDocuments({ role: 'mentee' });

    res.status(200).json({ totalUsers, totalMentors, totalMentees });
  } catch (error) {
    res.status(500).json({ message: 'Failed to fetch stats' });
  }
});

// Manual Match Creation
router.post('/matches', authMiddleware, adminMiddleware, async (req, res) => {
  const { mentorId, menteeId, topic } = req.body;
  try {
    const match = await MatchModel.create({
      mentor: mentorId,
      mentee: menteeId,
      topic,
      status: 'assigned'
    });
    res.status(201).json(match);
  } catch (error) {
    res.status(500).json({ message: 'Failed to create match manually' });
  }
});

// Create A Session Manually
router.post('/sessions', authMiddleware, adminMiddleware, async (req, res) => {
  try {
    const { mentee, mentor, scheduledDate, topic } = req.body;

    const session = await SessionModel.create({
      mentee,
      mentor,
      scheduledDate,
      topic,
      status: 'upcoming',
    });

    res.status(201).json(session);
  } catch (error) {
    res.status(500).json({ message: 'Failed to create session' });
  }
});

// Delete A Session
router.delete('/sessions/:id', authMiddleware, adminMiddleware, async (req, res) => {
  try {
    await SessionModel.findByIdAndDelete(req.params.id);
    res.status(200).json({ message: 'Session deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: 'Failed to delete session' });
  }
});

export default router;