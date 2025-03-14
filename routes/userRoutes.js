import express from "express";
import { authMiddleware } from "../middleware/authMiddleware.js";
import { authorizeRoles } from "../middleware/roleMiddleware.js";
import { listAgriWaste, viewMarketplace, adminDashboard, sellOrganicFertilizer, registerVehicle } from "../controllers/userController.js";

const userRouter = express.Router();

// 🧑‍🌾 Farmer can sell agri-waste
userRouter.post("/sell-agriwaste", authMiddleware, authorizeRoles("farmer"), listAgriWaste);

// 🛒 Buyer can access marketplace
userRouter.get("/marketplace", authMiddleware, authorizeRoles("buyer"), viewMarketplace);

// 🚚 Truck Driver can register vehicle
userRouter.post("/register-vehicle", authMiddleware, authorizeRoles("truck_driver"), registerVehicle);

// 🌱 Organic Fertilizer Seller can list and sell products
userRouter.post("/sell-organic-fertilizer", authMiddleware, authorizeRoles("organic_seller"), sellOrganicFertilizer);

// 🛑 Admin dashboard (Only accessible by admin)
userRouter.get("/admin-dashboard", authMiddleware, authorizeRoles("admin"), adminDashboard);

export default userRouter;