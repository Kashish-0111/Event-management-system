import { Router } from "express";
import {
    getAllEvents,
    getEventById,
    createEvent,
    updateEvent,
    deleteEvent,
    getMyEvents
} from "../controllers/event.controllers.js";
import { verifyJWT } from '../middlewares/auth.middleware.js';

import {isOrganizer} from "../middlewares/role.middleware.js"

import { upload } from "../middlewares/multer.middleware.js";

const router = Router();

router.route("/").get(getAllEvents)
router.route("/:id").get(getEventById)

// Protected routes - Organizer only
router.route("/")
    .post(verifyJWT, isOrganizer, upload.single("image"), createEvent);  // Changed path from /create

router.route("/my-events")
    .get(verifyJWT, isOrganizer, getMyEvents);  // Added - Get organizer's events

router.route("/:id")
    .put(verifyJWT, isOrganizer, upload.single("image"), updateEvent)  // Added image upload
    .delete(verifyJWT, isOrganizer, deleteEvent);

export default router;