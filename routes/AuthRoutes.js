import express from "express";
import {
  register,
  login,
  logout,
  getUserData
} from "../controller/Auth.js";

const AuthRoutes = express.Router();

// User Registration Route
AuthRoutes.post("/register", register);

// User Login Route
AuthRoutes.post("/login", login);

// User Logout Route
AuthRoutes.post("/logout", logout);

// Get User Data by ID
AuthRoutes.get("/getUserData/:id", getUserData);

export default AuthRoutes;