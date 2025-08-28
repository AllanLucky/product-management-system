import handleAsyncError from "../middleware/handleAsyncError.js";
import HandleError from "../utils/handleError.js";
import User from "../models/userModel.js";
import { sendToken } from "../utils/jwtToken.js";
import { sendEmail } from "../utils/sendEmail.js";
import { v2 as cloudinary } from 'cloudinary';
import crypto from 'crypto'
    ;
import { url } from "inspector";

/**
 * @desc    Register a new user
 * @route   POST /api/v1/register
 * @access  Public
 */
export const registerUser = handleAsyncError(async (req, res) => {
    const { name, email, password, avatar } = req.body;

    const myCloud = await cloudinary.uploader.upload(avatar, {
        folder: 'avatars',
        width: 150,
        crop: 'scale'
    });

    if (!name || !email || !password) {
        return res.status(400).json({
            success: false,
            statusCode: 400,
            message: "Please provide all required fields."
        });
    }

    const existingUser = await User.findOne({ email });
    if (existingUser) {
        return res.status(400).json({
            success: false,
            statusCode: 400,
            message: "User already exists."
        });
    }

    const user = await User.create({
        name,
        email,
        password,
        avatar: {
            public_id: myCloud.public_id,
            url: myCloud.secure_url,
        }
    });

    // ✅ Do not call sendToken
    res.status(201).json({
        success: true,
        statusCode: 201,
        message: "User registered successfully. Please log in.",
    });
});


/**
 * @desc    Login user
 * @route   POST /api/v1/login
 * @access  Public
 */
export const loginUser = handleAsyncError(async (req, res, next) => {
    const { email, password } = req.body;

    if (!email || !password) {
        return next(new HandleError("Email and password are required.", 400));
    }
    const user = await User.findOne({ email }).select("+password");
    if (!user) {
        return next(new HandleError("Invalid email or password.", 401));
    }
    const isMatch = await user.comparePassword(password);
    if (!isMatch) {
        return next(new HandleError("Invalid email or password.", 401));
    }
    sendToken(user, 200, res);
});

/**
 * @desc    Logout user
 * @route   GET /api/v1/logout
 * @access  Private
 */
export const Logout = handleAsyncError(async (req, res, next) => {
    res.cookie("token", null, {
        expires: new Date(Date.now()),
        httpOnly: true
    });
    res.status(200).json({
        success: true,
        message: "Successfully logged out."
    });
});

/**
 * @desc    Request password reset token
 * @route   POST /api/v1/password/forgot
 * @access  Public
 */
export const requestPasswordReset = handleAsyncError(async (req, res, next) => {
    const user = await User.findOne({ email: req.body.email });
    if (!user) {
        return next(new HandleError("User does not exist", 400));
    }
    let resetToken;
    try {
        resetToken = user.generatePasswordResetToken();
        await user.save({ validateBeforeSave: false });
    } catch (error) {
        return next(new HandleError("Could not save reset token. Please try again later", 500));
    }

    const resetPasswordURL = `${req.protocol}://${req.get('host')}/reset/${resetToken}`;
    const message = `Use the following link to reset your password: ${resetPasswordURL}. \n\nThis link will expire in 30 minutes. \n\nIf you didn't request a password reset, please ignore this.`;

    try {
        await sendEmail({
            email: user.email,
            subject: 'Password Reset Request',
            message
        });
        res.status(200).json({
            success: true,
            message: `Email is sent to ${user.email} successfully`
        });
    } catch (error) {
        user.resetPasswordToken = undefined;
        user.resetPasswordExpire = undefined;
        await user.save({ validateBeforeSave: false });

        return next(new HandleError("Email could not be sent. Please try again later", 500));
    }
});

/**
 * @desc    Reset password
 * @route   POST /api/v1/reset/:token
 * @access  Public
 */
export const resetPassword = handleAsyncError(async (req, res, next) => {
    const resetPasswordToken = crypto
        .createHash("sha256")
        .update(req.params.token)
        .digest("hex");
    const user = await User.findOne({
        resetPasswordToken,
        resetPasswordExpire: { $gt: Date.now() }
    });

    if (!user) {
        return next(new HandleError("Reset password token is invalid or has been expired", 400))
    }
    const { password, confirmPassword } = req.body

    if (password !== confirmPassword) {
        return next(new HandleError("Password doesnt match", 400))
    }
    user.password = password
    user.resetPasswordToken = undefined;
    user.resetPasswordExpire = undefined;
    await user.save();

    sendToken(user, 200, res)
});


// Get user Details
export const getUserDetails = handleAsyncError(async (req, res, next) => {
    const user = await User.findById(req.user.id);
    res.status(200).json({
        success: true,
        user
    });
});


// Update password 
export const updatePassword = handleAsyncError(async (req, res, next) => {
    const { oldPassword, newPassword, confirmPassword } = req.body;
    const user = await User.findById(req.user.id).select("+password");
    if (!user) {
        return next(new HandleError("User not found", 404));
    }
    const checkPasswordMatch = await user.comparePassword(oldPassword);

    if (!checkPasswordMatch) {
        return next(new HandleError("Password is incorrect", 400));
    }
    if (newPassword !== confirmPassword) {
        return next(new HandleError("Passwords do not match", 400));
    }
    user.password = newPassword;

    await user.save();

    sendToken(user, 200, res);
});


// Update User Profile

export const updateProfile = handleAsyncError(async (req, res, next) => {
    const { name, email, avatar } = req.body; // ✅ Get avatar from body
    const updateUserDetails = {
        name,
        email,
    };

    if (avatar !== "") {
        const userData = await User.findById(req.user.id); // ✅ different variable name
        const imageId = userData.avatar.public_id;
        await cloudinary.uploader.destroy(imageId);

        const myCloud = await cloudinary.uploader.upload(avatar, {
            folder: "avatars",
            width: 150,
            crop: "scale"
        });

        updateUserDetails.avatar = {
            public_id: myCloud.public_id,
            url: myCloud.secure_url,
        };
    }

    const user = await User.findByIdAndUpdate(req.user.id, updateUserDetails, {
        new: true,
        runValidators: true
    });

    res.status(200).json({
        success: true,
        message: "Profile updated Successfully",
        user
    });
});



// Admin getting User Information

export const getUsersList = handleAsyncError(async (req, res, next) => {
    const users = await User.find();
    res.status(200).json({
        success: true,
        users
    })
})

// Admin Getting Single User Details

export const getSingleUser = handleAsyncError(async (req, res, next) => {
    const user = await User.findById(req.params.id);
    if (!user) {
        return next(new HandleError(`User doesnt exist with this id: ${req.params.id}`, 400))
    }
    res.status(200).json({
        success: true,
        user
    })

})

// Admin Changing User role

export const updateUserRole = handleAsyncError(async (req, res, next) => {
    const { role } = req.body;
    const newUserData = {
        role
    }
    const user = await User.findByIdAndUpdate(req.params.id, newUserData, {
        new: true,
        runValidators: true
    });

    if (!user) {
        return next(new HandleError("User doesnt exist", 400))
    }
    res.status(200).json({
        success: true,
        user
    })
})


// Admin Delete User Profile

export const deleteUserProfile = handleAsyncError(async (req, res, next) => {
    const user = await User.findById(req.params.id);
    if (!user) {
        return next(new HandleError("User doesnt exist", 400))
    }
    await User.findByIdAndDelete(req.params.id);
    res.status(200).json({
        success: true,
        message: "User Deleted successfully"
    })

})
