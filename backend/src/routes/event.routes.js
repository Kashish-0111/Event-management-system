import { Router } from "express";
import {
    getAllEvents,
    getEventById,
    createEvent,
    updateEvent,
    deleteEvent,registerForEvent,
        getAllRegistrations 
} from "../controllers/event.controllers.js";
import { verifyJWT } from '../middleswares/auth.middleware.js';

import {isAdmin} from "../middleswares/role.middleware.js"

import { upload } from "../middleswares/multer.middleware.js";

const router = Router();

router.route("/").get(getAllEvents)
router.route("/:id").get(getEventById)


router.route("/:id").put(verifyJWT,isAdmin,updateEvent)

router.route("/:id").delete(verifyJWT,isAdmin,deleteEvent)
router
  .route("/create")
  .post(verifyJWT, isAdmin, upload.single("image"), createEvent);

  router.post("/:id/register", verifyJWT, registerForEvent);

  router.get("/registrations", verifyJWT, isAdmin, getAllRegistrations);



export  default router;