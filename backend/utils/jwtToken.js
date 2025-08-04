export const sendToken = (user, statuscode, res) => {
    const token = user.getJWTToken();

    const Options = {
        expires: new Date(Date.now() + Number(process.env.EXPIRE_COOKIES) * 24 * 60 * 60 * 1000),
        httpOnly: true
    };

    // It removes the password field from the user object before sending it in the API
    // Even though it's hashed, the password should never be returned to the frontend.
    user.password = undefined;

    res.status(statuscode).cookie('token', token, Options)
        .json({
            success: true,
            user,
            token
        });
};
