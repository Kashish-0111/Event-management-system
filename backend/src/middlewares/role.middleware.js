
import { ApiError } from "../utils/ApiError.js";
import { asyncHandler } from "../utils/asyncHandler.js";

export const isOrganizer = asyncHandler(async (req, res, next) => {
  console.log("User userType:", req.user?.userType);  // ✅ Debug
  if (req.user?.userType !== "organizer") {
    throw new ApiError(403, "Access denied: Organizers only");
  }
  next();
});
