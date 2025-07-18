import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import bodyParser from "body-parser";
import connectDb from "./config/Mongodb.js";
import AuthRoutes from "./routes/AuthRoutes.js";
import ProfileRoutes from "./routes/ProfileRoutes.js";
import cookieParser from "cookie-parser"; 
import mentorRoutes from "./routes/mentorRoutes.js";
import { authMiddleware } from './middleware/authMiddleware.js';
import { adminMiddleware } from './middleware/adminMiddleware.js';
import adminRoutes from './routes/adminRoutes.js';
import sessionRoutes from './routes/sessionRoutes.js';

dotenv.config();

const port = process.env.PORT;
const app = express();
  app.set('trust proxy', 1);

app.use(express.json());
app.use(cookieParser());

const allowOrigin =["https://mariamadeyemo-mentormatch-dsaproject.netlify.app","http://localhost:5173"]
app.use(cors ({
  origin:allowOrigin,
  credentials:true,
  methods:["GET","POST", "PUT", "DELETE","OPTIONS"],
  allowedHeaders: ["Content-Type", "Authorization", "withCredentials"],
}))
app.use("/api/auth", AuthRoutes);
app.use("/api/profile", ProfileRoutes);
app.use('/api/admin', authMiddleware, adminMiddleware, adminRoutes);
app.use('/api/mentor', authMiddleware, mentorRoutes);
app.use('/api/sessions', sessionRoutes);
app.use('/api/mentor', mentorRoutes);
// Connecting to Database

// TEST Route
app.get("/", (req, res) => {
  res.json({ message: "Welcome to Backend" });
});

app.get("/api/health", (req, res) => {
  res.status(200).json({ message: "✅ API is healthy!" });
});

// DB and server startup
connectDb();
app.listen(8000, () => {
  console.log("Server is running");
});