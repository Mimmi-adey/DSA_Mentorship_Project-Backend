import mongoose from "mongoose";

const sessionSchema = new mongoose.Schema(
  {
    mentorId: { type: mongoose.Schema.Types.ObjectId, ref: "users", required: true },
    menteeId: { type: mongoose.Schema.Types.ObjectId, ref: "users", required: true },
    date: { type: Date, required: true },
    status: { type: String, enum: ["scheduled", "completed", "cancelled"], default: "scheduled" },
    feedback: {
      type: [
        {
          from: { type: mongoose.Schema.Types.ObjectId, ref: "users" },
          rating: { type: Number, min: 1, max: 5 },
          comment: { type: String },
        },
      ],
      default: [],
    },
  },
  { timestamps: true }
);

const SessionModel = mongoose.model("sessions", sessionSchema);
export default SessionModel;