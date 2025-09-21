import HandleError from "../utils/handleError.js";
import handleAsyncError from "./handleAsyncError.js";
import User from "../models/userModel.js";
import jwt from "jsonwebtoken";

export const verifyUserAuth = handleAsyncError(async (req, res, next) => {
    const { token } = req.cookies;

    if (!token) {
        return next(new HandleError("You need to log in to continue. Please sign in first!s", 401));
    }

    const decodedData = jwt.verify(token, process.env.JWT_SECRET_KEY);

    req.user = await User.findById(decodedData.id);
    next();
});


/**
 * Middleware to restrict route access based on user roles.
 * @param  {...string} roles - List of allowed roles (e.g., 'admin', 'superadmin')
 */

export const roleBasedAccess = (...roles) => {
    return (req, res, next) => {
        // Check if the user's role is included in the allowed roles
        if (!roles.includes(req.user.role)) {
            // If not, return a 403 Forbidden error
            return next(
                new HandleError(`Role - ${req.user.role} is not allowed to access this resource`, 403)
            );
        }

        // If the user has the required role, proceed to the next middleware/controller
        next();
    };
};

