import jwt from "jsonwebtoken"; // Correct import statement
import { blacklistedTokens } from "../controllers/authController.js"; // Import the blacklistedTokens set

export const authMiddleware = (req, res, next) => {
    const authHeader = req.header("Authorization");

    if (!authHeader || !authHeader.startsWith("Bearer ")) {
        return res.status(401).json({ msg: "No token, authorization denied" });
    }

    const token = authHeader.split(" ")[1];

    if (!token) {
        return res.status(401).json({ msg: "No token, authorization denied" });
    }

    // Check if the token is blacklisted
    if (blacklistedTokens.has(token)) {
        console.log("Attempted use of blacklisted token:", token);
        return res.status(401).json({ msg: "Token has been blacklisted. Please log in again." });
    }

    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        console.log("Decoded Token:", decoded);
        req.user = decoded;
        next();
    } catch (err) {
        console.log("Token Verification Error:", err.message);
        res.status(401).json({ msg: "Token is not valid" });
    }
};

export const protect = (req, res, next) => {
    const token = req.headers.authorization?.split(' ')[1];

    if (!token) return res.sendStatus(401);

    // Check if token is blacklisted
    if (blacklistedTokens.has(token)) {
        console.log("Attempted access with blacklisted token:", token);
        return res.status(401).json({ message: "Token has been blacklisted. Please log in again." });
    }

    jwt.verify(token, process.env.JWT_SECRET, (err, user) => {
        if (err) return res.sendStatus(403);
        req.user = user;
        next();
    });
};