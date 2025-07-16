import express from "express";
import {getUserData, EditProfile} from "../controller/Profile.js";
import {authMiddleware} from "../middleware/authMiddleware.js";

const ProfileRoutes = express.Router();

ProfileRoutes.get("/getUserData/:id", authMiddleware, getUserData);
ProfileRoutes.put("/editProfile/:id", authMiddleware, EditProfile);
ProfileRoutes.get("/profile", authMiddleware, (req, res) => {
  const { _id, name, email, role, bio, skills, goals } = req.user;

  res.status(200).json({
    id: _id,
    name,
    email,
    role,
    bio,
    skills,
    goals,
  });
});


export default ProfileRoutes;