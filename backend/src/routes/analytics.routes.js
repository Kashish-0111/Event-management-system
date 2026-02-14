// backend/src/routes/analytics.routes.js

import { Router } from "express";
import { getEventRecommendations } from "../controllers/analytics.controllers.js";
import { verifyJWT } from "../middlewares/auth.middleware.js";
import { isOrganizer } from "../middlewares/role.middleware.js";

const router = Router();

// Get AI-powered event recommendations (Organizer only)
router.route("/event-recommendations").get(verifyJWT, isOrganizer, getEventRecommendations);

export default router;