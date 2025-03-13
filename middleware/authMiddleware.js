import jwt from "jsonwebtoken"; // Correct import statement

export const authMiddleware = (req, res, next) => {
    const authHeader = req.header("Authorization");

    if (!authHeader || !authHeader.startsWith("Bearer ")) {
        return res.status(401).json({ msg: "No token, authorization denied" });
    }

    const token = authHeader.split(" ")[1]; // Extract the token after "Bearer "

    if (!token) {
        return res.status(401).json({ msg: "No token, authorization denied" });
    }

    try {
        // Verify the token
        const decoded = jwt.verify(token, process.env.JWT_SECRET); // Use jwt.verify directly
        console.log("Decoded Token:", decoded); // Log the decoded token for debugging
        req.user = decoded; // Attach the decoded user data to the request object
        next();
    } catch (err) {
        console.log("Token Verification Error:", err.message); // Log the error for debugging
        res.status(401).json({ msg: "Token is not valid" });
    }
};