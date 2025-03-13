import mongoose from "mongoose";

const UserSchema = new mongoose.Schema({

    name: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    role: { type: String, enum: ["farmer", "buyer", "admin", "organicFertilizerSeller", "truckDriver"], default: "farmer" },
    resetPasswordToken: { type: String },
    resetPasswordExpire: { type: Date },
    isVerified: { type: Boolean, default: false }, // New field for email verification status
    verificationToken: { type: String } // New field for storing the verification token

}, { timestamps: true });

export const User = mongoose.model("User", UserSchema);