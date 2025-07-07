import express from "express";
import { createSession, getSessionsByUser, addFeedback } from "../controller/Session.js";

const router = express.Router();

router.post("/create", createSession);
router.get("/:userId", getSessionsByUser);
router.put("/feedback/:sessionId", addFeedback);

export default router;