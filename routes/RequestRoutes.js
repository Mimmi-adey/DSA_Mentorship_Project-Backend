import express from "express";
import { sendRequest, getMentorRequests, updateRequestStatus } from "../controller/Request.js";

const router = express.Router();

router.post("/send", sendRequest);
router.get("/mentor/:mentorId", getMentorRequests);
router.put("/update/:requestId", updateRequestStatus);

export default router;