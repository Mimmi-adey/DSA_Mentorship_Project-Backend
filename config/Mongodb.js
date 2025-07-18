import mongoose from "mongoose";
import dotenv from "dotenv";

dotenv.config();

const connectDb = async () => {
  try {
    mongoose.connection.on("error", (error) => {
      console.error("MongoDB connection error:", error);
    });

    const url = `${process.env.MONGODB_URL}/MentorProject`;
    await mongoose.connect(url);
    console.log("✅ Database connected successfully");
  } catch (error) {
    console.log("❌ DB connection failed:", error);
  }
};

export default connectDb;