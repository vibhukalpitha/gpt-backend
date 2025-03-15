import mongoose from "mongoose";

const UserSchema = new mongoose.Schema({

    name: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    phone: { type: String, required: true },
    password: { type: String, required: true },
    role: { type: String, enum: ["farmer", "buyer", "admin", "organic_seller", "truck_driver"], default: "farmer" },
    resetPasswordToken: { type: String },
    resetPasswordExpire: { type: Date },
    isVerified: { type: Boolean, default: false }, // New field for email verification status
    verificationToken: { type: String }, // New field for storing the verification token
    twoStepVerificationCode: { type: String }, // New field for 2-step verification code
    twoStepVerificationExpire: { type: Date } // New field for 2-step verification code expiry

}, { timestamps: true });

export const User = mongoose.model("User", UserSchema);