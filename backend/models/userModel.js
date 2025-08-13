import mongoose from "mongoose";
import validator from "validator";
import bcryptjs from "bcryptjs";
import crypto from "crypto";
import jwt from "jsonwebtoken";

const userSchema = new mongoose.Schema(
    {
        name: {
            type: String,
            required: [true, "Please enter your name"],
            trim: true,
            maxlength: [50, "Name must be less than 50 characters"],
            minlength: [3, "Name must be more than 3 characters"]
        },
        email: {
            type: String,
            required: [true, "Please enter your email"],
            unique: true,
            validate: {
                validator: validator.isEmail,
                message: "Please enter a valid email"
            }
        },
        password: {
            type: String,
            required: [true, "Please enter your password"],
            minlength: [8, "Password must be at least 8 characters"],
            select: false
        },
        avatar: {
            public_id: {
                type: String,
                required: true
            },
            url: {
                type: String,
                required: true
            }
        },
        role: {
            type: String,
            enum: ["user", "admin", "vendor"],
            default: "user"
        },
        resetPasswordToken: String,
        resetPasswordExpire: Date
    },
    {
        timestamps: true
    }
);

// Hash password before save
userSchema.pre("save", async function (next) {
    if (!this.isModified("password"))
        return next();

    const salt = await bcryptjs.genSalt(10);
    this.password = await bcryptjs.hash(this.password, salt);
    next();
});

// Generate JWT
userSchema.methods.getJWTToken = function () {
    return jwt.sign(
        { id: this._id, role: this.role },
        process.env.JWT_SECRET_KEY,
        { expiresIn: process.env.JWT_EXPIRE }
    );
};

// Compare password
userSchema.methods.comparePassword = async function (enteredPassword) {
    return await bcryptjs.compare(enteredPassword, this.password);
};

// Generate password reset token
userSchema.methods.generatePasswordResetToken = function () {
    const resetToken = crypto.randomBytes(20).toString("hex");

    this.resetPasswordToken = crypto
        .createHash("sha256")
        .update(resetToken)
        .digest("hex");

    this.resetPasswordExpire = Date.now() + 30 * 60 * 1000; // 30 mins
    return resetToken;
};

export default mongoose.model("User", userSchema);
