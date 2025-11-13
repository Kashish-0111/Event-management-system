import { bookEvent } from "../controllers/booking.controllers";

import {Router} from "ëxpress";
import { verifyJWT } from "../middleswares/auth.middleware";

const router = Router();

router.post("/bookings", verifyJWT, bookEvent);



export  default router;