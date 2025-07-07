import mongoose from "mongoose";

const requestSchema = new mongoose.Schema(
  {
    menteeId: { type: mongoose.Schema.Types.ObjectId, ref: "users", required: true },
    mentorId: { type: mongoose.Schema.Types.ObjectId, ref: "users", required: true },
    status: { type: String, enum: ["pending", "accepted", "rejected"], default: "pending" },
  },
  { timestamps: true }
);

const RequestModel = mongoose.model("requests", requestSchema);
export default RequestModel;