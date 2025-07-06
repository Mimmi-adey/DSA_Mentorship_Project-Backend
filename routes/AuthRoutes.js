import {get} from "mongoose";
import {register, login, logout, getUserData} from "../controller/Auth.js";
import express from "express";
const AuthRoutes = express.Router()

// User Registration Route
AuthRoutes.post("/register", register)
AuthRoutes.post("/login", login)
AuthRoutes.post("/logout", logout)
AuthRoutes.get("/getUserData/:id", getUserData)

export default AuthRoutes;