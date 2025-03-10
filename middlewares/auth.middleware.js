import { JWT_SECRET } from "../config/env.js";
import jwt from "jsonwebtoken";
import User from "../models/user.model.js";

export const authorize = async (req, res, next) => {
  try {
    let token;
    
    // ✅ Check if Authorization header exists
    if (req.headers.authorization && req.headers.authorization.toLowerCase().startsWith("bearer")) {
      token = req.headers.authorization.split(" ")[1];
    }

    // ✅ If no token, return Unauthorized error
    if (!token) {
      return res.status(401).json({ message: "Unauthorized - No token provided" });
    }

    // ✅ Decode JWT token
    const decoded = jwt.verify(token, JWT_SECRET);
    console.log("Decoded Token:", decoded);  // Debugging line

    // ✅ Check if user exists
    const user = await User.findById(decoded.userId || decoded._id); // Make sure the key matches the token payload
    if (!user) {
      return res.status(401).json({ message: "Unauthorized - User not found" });
    }

    req.user = user;
    next();
  } catch (error) {
    console.log("Auth Middleware Error:", error.message); // Debugging log
    res.status(401).json({ message: "Unauthorized", error: error.message });
  }
};
