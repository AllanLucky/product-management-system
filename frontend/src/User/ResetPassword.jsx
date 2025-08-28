import React, { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useParams, useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import "../UserStyles/Form.css";

import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import PageTitle from "../components/PageTitle";
import { removeErrors, removeSuccess, resetPassword } from "../features/user/userSlice";

function ResetPassword() {
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const { token } = useParams(); // <-- grab token from /reset/:token

    const [password, setPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");

    const { loading, error, success, message } = useSelector(
        (state) => state.user
    );

    const resetPasswordSubmit = (e) => {
        e.preventDefault();

        if (password !== confirmPassword) {
            toast.error("Passwords do not match");
            return;
        }

        // ✅ dispatch with { token, userData }
        dispatch(
            resetPassword({
                token,
                userData: { password, confirmPassword },
            })
        );
    };

    // Clear any old success/error on mount
    useEffect(() => {
        dispatch(removeSuccess());
    }, [dispatch]);

    useEffect(() => {
        if (error) {
            toast.error(error);
            dispatch(removeErrors());
        }
        if (success) {
            toast.success(message || "Password reset successfully");
            setPassword("");
            setConfirmPassword("");
            navigate("/login"); // after reset, go back to login
            dispatch(removeSuccess()); // clear success to prevent duplicate toasts
        }
    }, [dispatch, error, success, message, navigate]);

    return (
        <>
            <Navbar />
            <PageTitle title="Reset Password" />
            <div className="container form-container">
                <div className="form-content">
                    <form className="form" onSubmit={resetPasswordSubmit}>
                        <h2>Reset Password</h2>
                        <div className="input-group">
                            <input
                                type="password"
                                name="password"
                                placeholder="New Password"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                required
                            />
                        </div>
                        <div className="input-group">
                            <input
                                type="password"
                                name="confirmPassword"
                                placeholder="Confirm Password"
                                value={confirmPassword}
                                onChange={(e) => setConfirmPassword(e.target.value)}
                                required
                            />
                        </div>
                        <button className="authBtn" type="submit" disabled={loading}>
                            {loading ? "Resetting..." : "Reset Password"}
                        </button>
                    </form>
                </div>
            </div>
            <Footer />
        </>
    );
}

export default ResetPassword;
