import jwt from "jsonwebtoken";
import AuthModel from "../models/authSchema.js";

const authMiddleware = async (req, res, next) => {
  try {
    const token = req.cookies?.token;

    if (!token) {
      return res.status(401).json({ message: "Unauthorized Access, No Token Found" });
    }

    let decodedToken;
    try {
      decodedToken = jwt.verify(token, process.env.JWT_SECRETKEY);
    } catch (error) {
      console.log("Token verification error:", error);
      return res.status(401).json({ message: "Invalid Token or Token has Expired" });
    }

    const user = await AuthModel.findById(decodedToken.id).select("-password");
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    req.user = user;
    next();
  } catch (error) {
    console.log("Auth middleware server error:", error);
    return res.status(500).json({ message: "Server error in auth middleware" });
  }
};

export { authMiddleware };