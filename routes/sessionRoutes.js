import express from 'express';
import { submitFeedback } from '../controller/mentorcontroller.js';

const router = express.Router();

// POST /sessions/:id/feedback
router.post('/:id/feedback', submitFeedback);

export default router;