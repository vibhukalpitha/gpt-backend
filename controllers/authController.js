import { User } from "../models/user.js"
import  bcrypt  from "bcryptjs";
import jwt from "jsonwebtoken";
import crypto from "crypto";
import nodemailer from "nodemailer";

export const blacklistedTokens = new Set();

export const registerUser = async (req, res) => {
    const { name, email, password, role } = req.body;

    try {
        let user = await User.findOne({ email });
        if (user) return res.status(400).json({ msg: "User already exists" });

        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password, salt);

        // Generate verification token
        const verificationToken = crypto.randomBytes(32).toString("hex");

        user = new User({ name, email, password: hashedPassword, role, verificationToken });
        await user.save();

        // Configure Email Transport
        const transporter = nodemailer.createTransport({
            service: "Gmail",
            auth: { user: process.env.EMAIL_USER, pass: process.env.EMAIL_PASS }
        });

        // Send verification email
        const verificationURL = `http://localhost:3000/api/auth/verify-email/${verificationToken}`;
        const mailOptions = {
            to: user.email,
            from: process.env.EMAIL_USER,
            subject: "Email Verification",
            text: `Click the link to verify your email: ${verificationURL}`
        };

        await transporter.sendMail(mailOptions);

        res.status(201).json({ msg: "User registered successfully. Please check your email to verify your account." });
    } catch (err) {
        console.log(err);
        res.status(500).json({ msg: "Server Error" });
    }
};

export const loginUser = async (req, res) => {
    const { email, password } = req.body;

    try {
        const user = await User.findOne({ email });
        if (!user) return res.status(400).json({ msg: "Invalid Credentials" });

        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) return res.status(400).json({ msg: "Invalid Credentials" });

        // Check if the user's email is verified
        if (!user.isVerified) {
            return res.status(400).json({ msg: "Please verify your email before logging in." });
        }

        const token = jwt.sign({ id: user._id, role: user.role }, process.env.JWT_SECRET, { expiresIn: "1d" });

        res.json({ token, user: { id: user._id, name: user.name, email: user.email, role: user.role } });
    } catch (err) {
        console.log(err);
        res.status(500).json({ msg: "Server Error" });
    }
};

export const logoutUser = (req, res) => {
    const token = req.headers.authorization?.split(" ")[1];

    if (!token) {
        console.log("Logout failed: No token provided");
        return res.status(400).json({ message: "No token provided" });
    }

    if (blacklistedTokens.has(token)) {
        return res.status(401).json({ msg: "You are already logged out. Please log in." });
    }

    blacklistedTokens.add(token);
    console.log("Token blacklisted:", token);

    res.status(200).json({ message: "Logged out successfully" });
};

export const forgotPassword = async (req, res) => {
    const { email } = req.body;

    try {
        const user = await User.findOne({ email });
        if (!user) return res.status(404).json({ msg: "User not found" });

        // Generate Reset Token
        const resetToken = crypto.randomBytes(32).toString("hex");
        user.resetPasswordToken = resetToken;
        user.resetPasswordExpire = Date.now() + 7200000; // 1 hour expiration
        await user.save();

        // Configure Email Transport
        const transporter = nodemailer.createTransport({
            service: "Gmail",
            auth: { user: process.env.EMAIL_USER, pass: process.env.EMAIL_PASS }
        });

        // Send Reset Email
        const resetURL = `http://localhost:3000/reset-password/${resetToken}`;
        const mailOptions = {
            to: user.email,
            from: process.env.EMAIL_USER,
            subject: "Password Reset Request",
            text: `Click the link to reset your password: ${resetURL}`
        };

        await transporter.sendMail(mailOptions);
        res.json({ msg: "Reset link sent to email" });

    } catch (err) {
        console.log(err);
        res.status(500).json({ msg: "Server Error" });
    }
};

export const resetPassword = async (req, res) => {
    const { token } = req.params;
    const { password } = req.body;

    try {
        console.log("Token received:", token); // Debugging: Log the token
        const user = await User.findOne({
            resetPasswordToken: token,
            resetPasswordExpire: { $gt: Date.now() } // Check if token is still valid
        });

        if (!user) {
            console.log("User not found or token expired"); // Debugging: Log the issue
            return res.status(400).json({ msg: "Invalid or expired token" });
        }

        // Hash new password
        const salt = await bcrypt.genSalt(10);
        user.password = await bcrypt.hash(password, salt);
        
        // Clear reset fields
        user.resetPasswordToken = undefined;
        user.resetPasswordExpire = undefined;
        await user.save();

        res.json({ msg: "Password successfully reset" });

    } catch (err) {
        console.log(err);
        res.status(500).json({ msg: "Server Error" });
    }
};

export const verifyEmail = async (req, res) => {
    const { token } = req.params;

    try {
        const user = await User.findOne({ verificationToken: token });

        if (!user) {
            return res.status(400).json({ msg: "Invalid or expired token" });
        }

        user.isVerified = true;
        user.verificationToken = undefined; // Clear the verification token after verification
        await user.save();

        res.json({ msg: "Email verified successfully. You can now login." });
    } catch (err) {
        console.log(err);
        res.status(500).json({ msg: "Server Error" });
    }
};
