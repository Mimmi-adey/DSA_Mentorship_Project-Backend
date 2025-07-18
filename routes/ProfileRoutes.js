import express from "express";
import { getUserData, EditProfile } from "../controller/Profile.js";
import { authMiddleware } from "../middleware/authMiddleware.js";

const ProfileRoutes = express.Router();

// Get user profile by ID (used by admin or mentors viewing others)
ProfileRoutes.get("/getUserData/:id", authMiddleware, getUserData);

// Edit own profile
ProfileRoutes.put("/editProfile/:id", authMiddleware, EditProfile);

// Get own profile
ProfileRoutes.get("/", (req, res) => {
  res.status(200).json({ message: "Profile endpoint is working!" });
});

ProfileRoutes.get("/", authMiddleware, (req, res) => {
  const {
    _id,
    name,
    email,
    role,
    bio = "",
    skills = "",
    goal = "",
  } = req.user || {};

  res.status(200).json({
    id: _id,
    name,
    email,
    role,
    bio,
    skills,
    goal,
  });
});

export default ProfileRoutes;