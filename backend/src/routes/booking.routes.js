import { bookEvent, getMyBookings,
  getBookingById,
  cancelBooking,
  getAllBookings } from "../controllers/booking.controllers.js";

import {Router} from "ëxpress";
import { verifyJWT } from "../middleswares/auth.middleware.js";
import { isAdmin } from "../middleswares/role.middleware.js";

const router = Router();

router.post("/bookings", verifyJWT, bookEvent);
router.post("/bookings", verifyJWT, createBooking);
router.get("/bookings/my", verifyJWT, getMyBookings);
router.get("/bookings/:id", verifyJWT, getBookingById);
router.delete("/bookings/:id", verifyJWT, cancelBooking);
router.get("/admin/bookings",verifyJWT, isAdmin, getAllBookings);




export  default router;