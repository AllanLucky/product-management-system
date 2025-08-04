import HandleError from "../utils/handleError.js";

const errorHandlerMiddleware = (err, req, res, next) => {
    // Handle invalid MongoDB ObjectId errors (CastError)
    if (err.name === "CastError") {
        const message = `Invalid resource ID: ${err.path}`;
        err = new HandleError(message, 404);
    }

    // Duplicate key error
    if (err.code === 11000) {
        const field = Object.keys(err.keyValue)[0];
        const message = `This ${field} is already registered. Please login to continue.`;
        err = new HandleError(message, 400);
    }

    const statusCode = err.statusCode || 500;
    const message = err.message || "Internal Server Error";

    // Log error (optional)
    console.error("Error:", err);

    res.status(statusCode).json({
        success: false,
        statusCode,
        message,
    });
};

export default errorHandlerMiddleware;
