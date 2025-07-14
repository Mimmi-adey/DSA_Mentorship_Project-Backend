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

export default router;