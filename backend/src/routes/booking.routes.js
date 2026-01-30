import { Router } from "express";  // Fixed typo
import { 
    createBooking,  // Changed from bookEvent
    getMyBookings,
    getBookingById,
    cancelBooking,
    getEventRegistrations  // Added - for organizers
} from "../controllers/booking.controllers.js";
import { verifyJWT } from "../middlewares/auth.middleware.js";
import { isOrganizer } from "../middlewares/role.middleware.js";  // Added

const router = Router();

// User routes - Create and manage bookings
router.route("/")
    .post(verifyJWT, createBooking);  // POST /api/bookings - Create booking

router.route("/my-bookings")
    .get(verifyJWT, getMyBookings);  // GET /api/bookings/my-bookings - User's bookings

router.route("/:id")
    .get(verifyJWT, getBookingById)  // GET /api/bookings/:id - Single booking
    .delete(verifyJWT, cancelBooking);  // DELETE /api/bookings/:id - Cancel booking

// Organizer route - View event registrations
router.route("/event/:eventId")
    .get(verifyJWT, isOrganizer, getEventRegistrations);  // GET /api/bookings/event/:eventId

export default router;