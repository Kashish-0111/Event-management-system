
import { ApiError } from "../utils/ApiError.js";
import { asyncHandler } from "../utils/asyncHandler.js";

export const isOrganizer = asyncHandler(async (req, res, next) => {
  if (req.user?.role !== "organizer") {
    throw new ApiError(403, "Access denied: Organizers only");
  }
  next();
});
