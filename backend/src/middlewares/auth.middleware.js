import { ApiError } from "../utils/ApiError.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import jwt from "jsonwebtoken"
import {User} from "../models/user.model.js"



export const verifyJWT = asyncHandler(async (req, res, next) => {
  // console.log("\n=== JWT VERIFICATION START ===");
  // console.log("Cookies:", req.cookies);
  // console.log("Authorization Header:", req.headers.authorization);
  
  const token = req.cookies?.accessToken || req.header("Authorization")?.replace("Bearer ", "");
  
  // console.log("Extracted Token:", token);
  // console.log("Token length:", token?.length);
  
  if (!token) {
    // console.log("❌ No token found");
    throw new ApiError(401, "Unauthorized request - No token provided");
  }

  try {
    // console.log("JWT_SECRET exists:", !!process.env.ACCESS_TOKEN_SECRET);
    
    const decodedToken = jwt.verify(token, process.env.ACCESS_TOKEN_SECRET);
    // console.log("✅ Token decoded successfully:", decodedToken);
    
    const user = await User.findById(decodedToken?._id).select("-password -refreshToken");
    // console.log("User found:", user ? `Yes - ${user.email}` : "No");
    // console.log("User userType:", user?.userType);
    
    if (!user) {
      // console.log("❌ User not found in database");
      throw new ApiError(401, "Invalid Access Token - User not found");
    }

    req.user = user;
    // console.log("✅ JWT verification successful");
    // console.log("=== JWT VERIFICATION END ===\n");
    next();
  } catch (error) {
    // console.log("❌ JWT Verification Error:", error.message);
    // console.log("Error name:", error.name);
    // console.log("=== JWT VERIFICATION END ===\n");
    throw new ApiError(401, "Invalid access token: " + error.message);
  }
});
