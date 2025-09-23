import React, { useEffect } from "react";
import "../UserStyles/Profile.css";
import { Link } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import PageTitle from "../components/PageTitle";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import { removeSuccess } from "../features/user/userSlice";
import { toast } from "react-toastify";

function Profile() {
    const dispatch = useDispatch();
    const { user } = useSelector((state) => state.user);

    // ✅ Reset success messages and check avatar on mount
    useEffect(() => {
        dispatch(removeSuccess());

        if (!user?.avatar?.url) {
            toast.warning("You have not uploaded a profile image!", {
                position: "top-right",
                autoClose: 3000,
            });
        }
    }, [dispatch, user]);

    return (
        <>
            <PageTitle title="My Profile" />
            <Navbar />

            <div className="profile-container">
                {/* <div className="profile-header">
                    <h1 className="profile-heading">{user?.name || "User"}'s Profile</h1>
                </div> */}
                <div className="profile-content">
                    <div className="profile-image">
                        <img
                            src={user?.avatar?.url || "./images/profile.jpg"}
                            alt="User Profile"
                            className="profile-image"
                        />
                        <Link to="/profile/update" className="edit-profile-link">
                            Edit Profile
                        </Link>
                    </div>

                    <div className="profile-details">
                        <div className="profile-detail">
                            <h2>Username</h2>
                            <p>{user?.name || "N/A"}</p>
                        </div>
                        <div className="profile-detail">
                            <h2>Email</h2>
                            <p>{user?.email || "N/A"}</p>
                        </div>
                        <div className="profile-detail">
                            <h2>Joined On</h2>
                            <p>
                                {user?.createdAt
                                    ? String(user.createdAt).substring(0, 10)
                                    : "N/A"}
                            </p>
                        </div>
                        <div className="profile-buttons">
                            <Link to="/orders/user">My Orders</Link>
                            <Link to="/password/update">Change Password</Link>
                        </div>
                    </div>
                </div>
            </div>

            <Footer />
        </>
    );
}

export default Profile;
