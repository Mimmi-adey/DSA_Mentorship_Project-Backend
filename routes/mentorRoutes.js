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
import MentorModel from "../models/matchSchema.js";
import SessionModel from "../models/sessionSchema.js";
import MatchModel from "../models/matchSchema.js";

const mentorRoutes = express.Router();

mentorRoutes.post("/addMentor", addMentor);
mentorRoutes.get("/get-mentor", getMentor);
mentorRoutes.get("/dashboard", authMiddleware, getMentorDashboard);
mentorRoutes.post("/availability", authMiddleware, setAvailability);
mentorRoutes.get("/availability", authMiddleware, getAvailability);
mentorRoutes.get("/requests", authMiddleware, getMenteeRequests);
mentorRoutes.put("/requests/:id", authMiddleware, respondToRequest);
mentorRoutes.get("/sessions", authMiddleware, getMentorSessions);
mentorRoutes.post("/sessions/:id/feedback", authMiddleware, submitFeedback);


mentorRoutes.get("/mentordashboard", authMiddleware, async (req, res) => {
  try {
    const mentorId = req.user.id;

    const mentor = await MentorModel.findById(mentorId).select("fullName email");

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