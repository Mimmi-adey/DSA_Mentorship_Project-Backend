import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import bodyParser from "body-parser";
import connectDb from "./config/Mongodb.js";
import AuthRoutes from "./routes/AuthRoutes.js";
import ProfileRoutes from "./routes/ProfileRoutes.js";
import cookieParser from "cookie-parser";
dotenv.config();

const port = process.env.PORT;
const app = express();

app.use(express.json());
app.use(cookieParser());

const allowOrigin =["https://app.netlify.com/projects/mariamadeyemo-mentormatch-dsaproject/","http://localhost:5173/"]
app.use(cors ({
  origin:allowOrigin,
  credentials:true,
  methods:["GET","PUT","DELETE","POST"],
  allowedHeaders:["content-type", "Authorization"]
}))
app.use("/api/auth", AuthRoutes);
app.use("/api/profile", ProfileRoutes);
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