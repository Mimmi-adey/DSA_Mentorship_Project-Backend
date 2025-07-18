import bcrypt from 'bcryptjs';
import MentorModel from "../models/mentorSchema.js";
import MatchModel from '../models/matchSchema.js';
import SessionModel from '../models/sessionSchema.js';
import AuthModel from '../models/authSchema.js';

const addMentor = async (req, res) => {
  const salt = 8;
  try {
    const { name, email, availability, bio, topic, password } = req.body;
    const hashPassword = await bcrypt.hash(password, salt);

    const mentor = new MentorModel({
      name,
      email,
      password: hashPassword,
      availability,
      bio,
      topic,
    });

    await mentor.save();
    return res.status(200).json({ message: "Mentor Added Successfully" });

  } catch (error) {
    console.log(error);
    return res.status(500).json({ message: "Server error" });
  }
};

const BookSession = async (req, res) => {
  try {
    res.json({ message: "Booked session (placeholder)" });
  } catch (error) {
    console.log(error);
    return res.status(500).json({ message: "Server error" });
  }
};

const getMentor = async (req, res) => {
  try {
    const mentors = await MentorModel.find();
    res.status(200).json({ mentors });
  } catch (error) {
    console.log(error);
    return res.status(500).json({ message: "Server error" });
  }
};

// ✅ Mentor Dashboard
const getMentorDashboard = async (req, res) => {
  try {
    const mentorId = req.user.id;

    const sessions = await SessionModel.find({
      mentor: mentorId,
      scheduledDate: { $gte: new Date() },
    })
      .populate('mentee', 'fullName email')
      .sort('scheduledDate');

    const pendingMatches = await MatchModel.find({
      mentor: mentorId,
      status: 'pending',
    }).populate('mentee', 'fullName email');

    const mentor = await MentorModel.findById(mentorId).select('fullName email');

    res.status(200).json({
      mentor,
      upcomingSessions: sessions,
      pendingRequests: pendingMatches,
    });
  } catch (error) {
    res.status(500).json({ message: 'Failed to fetch dashboard data' });
  }
};

// Submit Feedback
    const submitFeedback = async (req, res) => {
  try {
    const { id } = req.params;
    const { feedback } = req.body;

    const session = await SessionModel.findByIdAndUpdate(
      id,
      { feedback },
      { new: true }
    );

    if (!session) {
      return res.status(404).json({ message: "Session not found" });
    }

    res.status(200).json({ message: "Feedback submitted", session });
  } catch (error) {
    console.error("Error submitting feedback:", error);
    res.status(500).json({ message: "Failed to submit feedback" });
  }
};


// ✅ Set Mentor Availability
    const setAvailability = async (req, res) => {
  try {
    const mentorId = req.user.id;
    const { availability } = req.body; 

    const mentor = await MentorModel.findByIdAndUpdate(
      mentorId,
      { availability },
      { new: true }
    );

    res.status(200).json({ message: "Availability updated", availability: mentor.availability });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Failed to set availability" });
  }
};

// ✅ Get Mentor Availability
    const getAvailability = async (req, res) => {
  try {
    const mentor = await MentorModel.findById(req.user.id);
    res.status(200).json({ availability: mentor.availability });
  } catch (error) {
    res.status(500).json({ message: "Failed to get availability" });
  }
};

// ✅ Get Mentee Pending Requests
    const getMenteeRequests = async (req, res) => {
  try {
    const mentorId = req.user.id;
    const requests = await MatchModel.find({ mentor: mentorId, status: 'pending' })
      .populate('mentee', 'fullName email');

    res.status(200).json(requests);
  } catch (error) {
    res.status(500).json({ message: "Failed to fetch mentee requests" });
  }
};

// ✅ Respond to Request (Accept or Reject)
    const respondToRequest = async (req, res) => {
  try {
    const { id } = req.params; // Match ID
    const { action } = req.body;

    const updated = await MatchModel.findByIdAndUpdate(
      id,
      { status: action === "accept" ? "assigned" : "rejected" },
      { new: true }
    );

    res.status(200).json({ message: `Request ${action}ed`, match: updated });
  } catch (error) {
    res.status(500).json({ message: "Failed to respond to request" });
  }
};

    const getMentorSessions = async (req, res) => {
  try {
    const mentorId = req.user.id;
    const sessions = await SessionModel.find({ mentor: mentorId })
      .populate('mentee', 'fullName email')
      .sort({ scheduledDate: -1 });

    res.status(200).json(sessions);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Failed to fetch mentor sessions" });
  }
};

export {
  addMentor,
  BookSession,
  getMentor,
  getMentorDashboard,
  setAvailability,
  getAvailability,
  getMenteeRequests,
  respondToRequest,
  getMentorSessions,
  submitFeedback,
};