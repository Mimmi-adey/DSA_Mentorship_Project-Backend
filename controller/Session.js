import SessionModel from "../models/SessionModel.js";

// Mentor sets a session slot
export const createSession = async (req, res) => {
  const { mentorId, menteeId, date } = req.body;
  try {
    const session = new SessionModel({ mentorId, menteeId, date });
    await session.save();
    res.status(201).json({ message: "Session scheduled", session });
  } catch (err) {
    res.status(500).json({ message: "Server error" });
  }
};

// Get sessions for a user
export const getSessionsByUser = async (req, res) => {
  const { userId } = req.params;
  try {
    const sessions = await SessionModel.find({
      $or: [{ mentorId: userId }, { menteeId: userId }],
    })
      .populate("mentorId", "-password")
      .populate("menteeId", "-password");

    res.status(200).json({ sessions });
  } catch (err) {
    res.status(500).json({ message: "Server error" });
  }
};

// Add Feedback
export const addFeedback = async (req, res) => {
  const { sessionId } = req.params;
  const { from, rating, comment } = req.body;

  try {
    const session = await SessionModel.findById(sessionId);
    if (!session) return res.status(404).json({ message: "Session not found" });

    // Prevent duplicate feedback from same user
    const alreadyLeft = session.feedback.some((f) => f.from.toString() === from);
    if (alreadyLeft) return res.status(400).json({ message: "Feedback already submitted" });

    session.feedback.push({ from, rating, comment });
    await session.save();

    res.status(200).json({ message: "Feedback added", session });
  } catch (err) {
    res.status(500).json({ message: "Server error" });
  }
};