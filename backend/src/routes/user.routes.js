import { Router } from 'express';
import { signupUser, loginUser, logoutUser, getCurrentUser } from '../controllers/user.controllers.js';
import { verifyJWT } from '../middlewares/auth.middleware.js';

const router = Router();

// Public routes
router.route("/signup").post(signupUser);  // Changed from SingupUser
router.route("/login").post(loginUser);

// Protected routes
router.route("/logout").post(verifyJWT, logoutUser);
router.route("/me").get(verifyJWT, getCurrentUser);  // Added - Get current user info

export default router;