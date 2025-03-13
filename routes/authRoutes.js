import express from "express";
import { registerUser, loginUser, verifyEmail } from "../controllers/authController.js";
import { authMiddleware } from "../middleware/authMiddleware.js";
import { forgotPassword, resetPassword } from "../controllers/authController.js";

const router = express.Router();

router.post("/register", registerUser);
router.post("/login", loginUser);
router.get("/profile", authMiddleware, (req, res) => {
    res.json({ msg: "Access granted", user: req.user });
});
router.post("/forgot-password", forgotPassword);  // Request password reset
router.post("/reset-password/:token", resetPassword);  // Reset password
router.get("/verify-email/:token", verifyEmail);  // Verify email

export default router;