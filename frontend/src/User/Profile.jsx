import React, { useEffect } from "react";
import '../UserStyles/Profile.css';
import { Link } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import PageTitle from "../components/PageTitle";
import { removeSuccess } from "../features/user/userSlice";
import { toast } from "react-toastify";

function Profile() {
    const dispatch = useDispatch();
    const { user } = useSelector(state => state.user);

    // Reset previous success/messages on mount
    useEffect(() => {
        dispatch(removeSuccess());

        // Guard: if no avatar, show a warning
        if (!user?.avatar?.url) {
            toast.warning("You have not uploaded a profile image!", {
                position: "top-right",
                autoClose: 3000,
            });
        }
    }, [dispatch, user]);

    return (
        <div className="profile-container">
            <PageTitle title={`${user?.name || ''} Profile`} />
            <div className="profile-image">
                <h1 className="profile-heading">My Profile</h1>
                <img
                    src={user?.avatar?.url || './images/profile.jpg'}
                    alt="User Profile"
                    className="profile-image"
                />
                <Link to="/profile/update">Edit Profile</Link>
            </div>
            <div className="profile-details">
                <div className="profile-detail">
                    <h2>Username</h2>
                    <p>{user?.name || 'N/A'}</p>
                </div>
                <div className="profile-detail">
                    <h2>Email</h2>
                    <p>{user?.email || 'N/A'}</p>
                </div>
                <div className="profile-detail">
                    <h2>Joined On:</h2>
                    <p>{user?.createdAt ? String(user.createdAt).substring(0, 10) : 'N/A'}</p>
                </div>
                <div className="profile-buttons">
                    <Link to="/orders/user">My Orders</Link>
                    <Link to="/password/update">Change Password</Link>
                </div>
            </div>
        </div>
    );
}

export default Profile;
