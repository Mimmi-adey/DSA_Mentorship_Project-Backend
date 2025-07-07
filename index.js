import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import bodyParser from "body-parser";
import connectDb from "./config/Mongodb.js";
import AuthRoutes from "./routes/AuthRoutes.js";
import ProfileRoutes from "./routes/ProfileRoutes.js";
import cookieParser from "cookie-parser";
import RequestRoutes from "./routes/RequestRoutes.js";
import SessionRoutes from "./routes/SessionRoutes.js";
import AdminRoutes from "./routes/AdminRoutes.js";
dotenv.config();

const port = process.env.PORT;
const app = express();

// ✅ FIXED CORS (no trailing slash, and comes first)
app.use(cors({
  origin: ["http://localhost:3000", "https://dsa-mentorship-project-frontend.onrender.com"],
  credentials: true
}));

app.use(express.json());
app.use(cookieParser());

app.use("/api/auth", AuthRoutes);
app.use("/api/profile", ProfileRoutes);
app.use("/api/requests", RequestRoutes);
app.use("/api/sessions", SessionRoutes);
app.use("/api/admin", AdminRoutes);

// TEST route
app.get("/", (req, res) => {
  res.json({ message: "Welcome to Backend" });
});

app.get("/test-cors", (req, res) => {
  res.json({ message: "CORS is working!" });
});

// DB and server startup
connectDb();
app.listen(8000, () => {
  console.log("Server is running");
});