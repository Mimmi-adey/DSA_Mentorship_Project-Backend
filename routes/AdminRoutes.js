import express from "express";
import AuthModel from "../models/authSchema.js";
import SessionModel from "../models/SessionModel.js";

const router = express.Router();

// Get all users
router.get("/users", async (req, res) => {
  try {
    const users = await AuthModel.find().select("-password");
    res.status(200).json({ users });
  } catch {
    res.status(500).json({ message: "Server error" });
  }
});

// Get all sessions
router.get("/sessions", async (req, res) => {
  try {
    const sessions = await SessionModel.find()
      .populate("mentorId", "-password")
      .populate("menteeId", "-password");
    res.status(200).json({ sessions });
  } catch {
    res.status(500).json({ message: "Server error" });
  }
});

export default router;