class HandleError extends Error {
    constructor(message, statusCode = 500) {
        super(message);
        this.statusCode = statusCode;
        this.isOperational = true; // Helps in future production monitoring/logging
        Error.captureStackTrace(this, this.constructor);
    }
}
export default HandleError;