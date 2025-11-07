import { Router } from "express";
import {
    getAllEvents,
    getEventById,
    createEvent,
    updateEvent,
    deleteEvent
} from "../controllers/event.controllers.js";
import { verifyJWT } from '../middleswares/auth.middleware.js';

import { verifyJWT } from "../middleswares/auth.middleware.js";

import {isAdmin} from "../middleswares/role.middleware.js"

const router = Router();

router.route("/").get(getAllEvents)
router.route("/:id").get(getEventById)

router.route("/").post( verifyJWT,isAdmin,createEvent)

router.route("/:id").put(verifyJWT,isAdmin,updateEvent)

router.route("/:id").delete(verifyJWT,isAdmin,deleteEvent)

export  default router;