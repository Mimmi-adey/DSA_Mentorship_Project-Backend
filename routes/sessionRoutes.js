import express from 'express';
import { submitFeedback } from '../controller/mentorcontroller.js';
import { authMiddleware } from '../middleware/authMiddleware.js';

const router = express.Router();

// Submit session feedback (only accessible by mentor or mentee involved)
router.post('/:id/feedback', authMiddleware, submitFeedback);

export default router;