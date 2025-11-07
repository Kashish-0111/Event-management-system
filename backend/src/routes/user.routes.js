import {Router} from 'express';
import { loginUser, SingupUser ,logoutUser} from '../controllers/user.controllers.js';
import { verifyJWT } from '../middleswares/auth.middleware.js';
import { isAdmin } from '../middleswares/role.middleware.js';


const router = Router();

router.route("/SingupUser").post(SingupUser)

router.route("/login").post(loginUser)

router.route("/logout").post(verifyJWT,logoutUser)

router.post("/admin/dashboard", verifyJWT, isAdmin, (req, res) => {
  res.status(200).json({ message: "Welcome Admin!" });
});

export  default router;