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
import MatchModel from '../models/matchSchema.js'; // ✅ FIXED: Import added

const router = express.Router();

// Health check
router.get('/test', (req, res) => {
  res.json({ message: 'Admin route is alive!' });
});

// Admin dashboard
router.get('/dashboard', authMiddleware, adminMiddleware, (req, res) => {
  res.status(200).json({ message: 'Welcome Admin. This is your dashboard.' });
});

// Users
router.get('/users', authMiddleware, adminMiddleware, getAllUsers);
router.put('/users/:id', authMiddleware, adminMiddleware, updateUserRole);

// Mentor Approvals
router.get('/mentors/pending', authMiddleware, adminMiddleware, async (req, res) => {
  try {
    const pendingMentors = await AuthModel.find({ role: 'mentor', status: 'pending' }); // ✅ Ensure 'status' field exists in AuthModel
    res.json(pendingMentors);
  } catch (error) {
    console.error('Error fetching pending mentors:', error);
    res.status(500).json({ message: 'Failed to fetch pending mentors' });
  }
});

router.put('/mentors/:id/approve', authMiddleware, adminMiddleware, async (req, res) => {
  try {
    const updated = await AuthModel.findByIdAndUpdate(
      req.params.id,
      { status: 'approved' },
      { new: true }
    ).select('-password');
    res.status(200).json(updated);
  } catch (error) {
    console.error('Error approving mentor:', error);
    res.status(500).json({ message: 'Failed to approve mentor' });
  }
});

router.put('/mentors/:id/reject', authMiddleware, adminMiddleware, async (req, res) => {
  try {
    const updated = await AuthModel.findByIdAndUpdate(
      req.params.id,
      { status: 'rejected' },
      { new: true }
    ).select('-password');
    res.status(200).json(updated);
  } catch (error) {
    console.error('Error rejecting mentor:', error);
    res.status(500).json({ message: 'Failed to reject mentor' });
  }
});

// Matches
router.get('/matches', authMiddleware, adminMiddleware, getAllMatches);
router.put('/matches/:id', authMiddleware, adminMiddleware, assignMentorToMatch);

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
    console.error('Error creating match:', error);
    res.status(500).json({ message: 'Failed to create match manually' });
  }
});

// Sessions
router.get('/sessions', authMiddleware, adminMiddleware, getAllSessions);

router.post('/sessions', authMiddleware, adminMiddleware, async (req, res) => {
  try {
    const { mentee, mentor, scheduledDate, topic, status } = req.body;

    const session = await SessionModel.create({
      mentee,
      mentor,
      scheduledDate,
      topic,
      status: status || 'upcoming',
    });

    res.status(201).json(session);
  } catch (error) {
    console.error('Error creating session:', error);
    res.status(500).json({ message: 'Failed to create session' });
  }
});

router.delete('/sessions/:id', authMiddleware, adminMiddleware, async (req, res) => {
  try {
    await SessionModel.findByIdAndDelete(req.params.id);
    res.status(200).json({ message: 'Session deleted successfully' });
  } catch (error) {
    console.error('Error deleting session:', error);
    res.status(500).json({ message: 'Failed to delete session' });
  }
});

router.get('/sessions/test', (req, res) => {
  res.json({ message: 'Sessions route reached!' });
});

// Reports Placeholder
router.get('/reports', authMiddleware, adminMiddleware, (req, res) => {
  res.json([{ id: 1, message: 'Inappropriate content reported' }]);
});

// Stats
router.get('/stats', authMiddleware, adminMiddleware, async (req, res) => {
  try {
    const totalUsers = await AuthModel.countDocuments();
    const totalMentors = await AuthModel.countDocuments({ role: 'mentor' });
    const totalMentees = await AuthModel.countDocuments({ role: 'mentee' });

    res.status(200).json({ totalUsers, totalMentors, totalMentees });
  } catch (error) {
    console.error('Error fetching stats:', error);
    res.status(500).json({ message: 'Failed to fetch stats' });
  }
});

export default router;