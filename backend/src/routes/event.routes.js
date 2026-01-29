import { Router } from "express";
import {
    getAllEvents,
    getEventById,
    createEvent,
    updateEvent,
    deleteEvent
} from "../controllers/event.controllers.js";
import { verifyJWT } from '../middleswares/auth.middleware.js';

import {isOrganizer} from "../middleswares/role.middleware.js"

import { upload } from "../middleswares/multer.middleware.js";

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