import mongoose from "mongoose"; 

const authSchema = new mongoose.Schema({
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  role: {
    type: String,
    enum: ["admin", "mentor", "mentee"],
    default: "mentee",
    required: true,
  },
  bio: { type: String, default: "" },
  skills: { type: [String], default: [] },
  goal: { type: String, default: "" },
}, {
  timestamps: true,
});

const AuthModel = mongoose.models.users || mongoose.model("users", authSchema);

export default AuthModel;