import React from "react";
import '../UserStyles/Profile.css';
import { Link } from "react-router-dom";
import { useSelector } from "react-redux";
import PageTitle from "../components/PageTitle";

function Profile() {
    const { user } = useSelector(state => state.user);

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
