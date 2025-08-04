// middleware/handleAsyncError.js
export default (myErrorFun) => {
    return (req, res, next) => {
        Promise.resolve(myErrorFun(req, res, next)).catch(next);
    };
};
// This middleware function wraps an asynchronous function and catches any errors that occur,
// passing them to the next middleware in the stack. This is useful for handling errors in async

