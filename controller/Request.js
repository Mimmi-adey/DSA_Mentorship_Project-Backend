import RequestModel from "../models/RequestModel.js";

// Send Request
export const sendRequest = async (req, res) => {
  const { menteeId, mentorId } = req.body;
  try {
    const existing = await RequestModel.findOne({ menteeId, mentorId });
    if (existing) return res.status(400).json({ message: "Request already sent." });

    const request = new RequestModel({ menteeId, mentorId });
    await request.save();

    res.status(201).json({ message: "Request sent", request });
  } catch (error) {
    res.status(500).json({ message: "Server error" });
  }
};

// Get Requests for a Mentor
export const getMentorRequests = async (req, res) => {
  const { mentorId } = req.params;
  try {
    const requests = await RequestModel.find({ mentorId })
      .populate("menteeId", "-password");
    res.status(200).json({ requests });
  } catch (error) {
    res.status(500).json({ message: "Server error" });
  }
};

// Update Request Status
export const updateRequestStatus = async (req, res) => {
  const { requestId } = req.params;
  const { status } = req.body;
  try {
    const request = await RequestModel.findByIdAndUpdate(
      requestId,
      { status },
      { new: true }
    );
    res.status(200).json({ message: "Request updated", request });
  } catch (error) {
    res.status(500).json({ message: "Server error" });
  }
};