import express from "express";
import {getUserData, EditProfile} from "../controller/Profile.js";
import {authMiddleware} from "../middleware/authMiddleware.js";

const ProfileRoutes = express.Router();

ProfileRoutes.get("/getUserData/:id", authMiddleware, getUserData);
ProfileRoutes.put("/editProfile/:id", authMiddleware, EditProfile);

export default ProfileRoutes;