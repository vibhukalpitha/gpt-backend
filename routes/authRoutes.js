import express from "express";
import { registerUser, loginUser, logoutUser, verifyEmail, verifyTwoStepCode } from "../controllers/authController.js";
import { authMiddleware } from "../middleware/authMiddleware.js";
import { forgotPassword, resetPassword } from "../controllers/authController.js";
import { getUsers, getUserById, updateUserDetails, deleteUser } from "../controllers/authController.js";

const router = express.Router();

router.post("/register", registerUser);
router.post("/login", loginUser);
router.post("/verify-two-step-code", verifyTwoStepCode);
router.post("/logout", logoutUser);
router.get("/profile", authMiddleware, (req, res) => {
    res.json({ msg: "Access granted", user: req.user });
});
router.post("/forgot-password", forgotPassword);  // Request password reset
router.post("/reset-password/:token", resetPassword);  // Reset password
router.get("/verify-email/:token", verifyEmail);  // Verify email
router.get("/getAllUsers", getUsers);
router.get("/searchUser/:id", getUserById);
router.put("/updateUser/:id", updateUserDetails);
router.delete("/userDelete/:id", deleteUser);


export default router;