import express from 'express';
import { authMiddleware } from '../middleware/authMiddleware.js';
import { adminMiddleware } from '../middleware/adminMiddleware.js';
import { getAllUsers, updateUserRole } from '../controller/adminController.js';

const router = express.Router();

// Admin Dashboard
router.get('/dashboard', authMiddleware, adminMiddleware, (req, res) => {
  res.status(200).json({ message: 'Welcome Admin. This is your dashboard.' })
});

// Get all users from controller
router.get('/users', authMiddleware, adminMiddleware, getAllUsers);

// Pending mentor approvals
router.get('/mentors/pending', authMiddleware, adminMiddleware, async (req, res) => {
  const pendingMentors = await AuthModel.find({ role: 'mentor', status: 'pending' });
  res.json(pendingMentors);
});

router.get('/reports', authMiddleware, adminMiddleware, (req, res) => {
  res.json([{ id: 1, message: 'Inappropriate content reported' }]);
});

router.put('/users/:id', authMiddleware, adminMiddleware, updateUserRole);

router.get('/test', (req, res) => {
  res.json({ message: 'Admin route is alive!' });
});

export default router;