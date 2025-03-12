import dotenv from "dotenv";
import express, { json } from "express";
import { connect } from "mongoose";
import cors from "cors";
import cookieParser from "cookie-parser";
import router from "./routes/authRoutes.js";

dotenv.config();


const app = express();

// Middleware
app.use(json());
app.use(cors());
app.use(cookieParser());

app.get("/", (req, res) => {
  res.send("Agri-Waste Backend API is Running...");
});

app.use("/api/auth", router);

// Start the server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));

// MongoDB Connection
connect(process.env.MONGO_URI, {
}).then(() => console.log("MongoDB Connected"))
  .catch(err => console.log(err));



