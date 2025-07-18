import express from "express";
import {
  addMentor,
  getMentor,
  setAvailability,
  getAvailability,
  getMenteeRequests,
  respondToRequest,
  getMentorDashboard,
  getMentorSessions,
  submitFeedback,
} from "../controller/mentorcontroller.js";
import { authMiddleware } from "../middleware/authMiddleware.js";
import SessionModel from "../models/sessionSchema.js";
import MatchModel from "../models/matchSchema.js";
import AuthModel from "../models/authSchema.js"; // For mentor profile

const mentorRoutes = express.Router();

// Create mentor profile (if needed)
mentorRoutes.post("/addMentor", addMentor);

// Get own mentor details
mentorRoutes.get("/get-mentor", authMiddleware, getMentor);

// Mentor dashboard overview
mentorRoutes.get("/dashboard", authMiddleware, getMentorDashboard);

// Weekly availability
mentorRoutes.post("/availability", authMiddleware, setAvailability);
mentorRoutes.get("/availability", authMiddleware, getAvailability);

// Mentee requests
mentorRoutes.get("/requests", authMiddleware, getMenteeRequests);
mentorRoutes.put("/requests/:id", authMiddleware, respondToRequest);

// Sessions & feedback
mentorRoutes.get("/sessions", authMiddleware, getMentorSessions);
mentorRoutes.post("/sessions/:id/feedback", authMiddleware, submitFeedback);

// Extra: Inline Mentor Dashboard (Raw)
mentorRoutes.get("/mentordashboard", authMiddleware, async (req, res) => {
  try {
    const mentorId = req.user.id;

    const mentor = await AuthModel.findById(mentorId).select("fullName email");

    const upcomingSessions = await SessionModel.find({ mentor: mentorId })
      .populate("mentee", "fullName email")
      .sort({ scheduledDate: 1 });

    const pendingRequests = await MatchModel.find({ mentor: mentorId, status: "pending" })
      .populate("mentee", "fullName email");

    res.status(200).json({
      mentor,
      upcomingSessions,
      pendingRequests,
    });
  } catch (error) {
    console.error("Dashboard fetch error:", error);
    res.status(500).json({ message: "Failed to load dashboard data" });
  }
});

export default mentorRoutes;