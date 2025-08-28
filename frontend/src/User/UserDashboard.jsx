import React from 'react';
import '../UserStyles/UserDashboard.css';
import { useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { toast } from 'react-toastify';;
import { logoutUser, removeSuccess } from '../features/user/userSlice';
import { useState } from 'react';

function UserDashboard() {
    const { cartItems } = useSelector(state => state.cart)
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const [menuVisible, setMenuVisible] = useState(false);
    function toggleMenu() {
        setMenuVisible(!menuVisible)
    }

    // Get the logged-in user from Redux state
    const { user } = useSelector((state) => state.user);
    // Define dashboard menu options
    const options = [
        { name: "Orders", funcName: orders },
        { name: "Account", funcName: profile },
        { name: `(Cart ${cartItems.length})`, funcName: myCart, isCart: true },
        { name: "Logout", funcName: handleLogout },
    ];
    // If user is admin, add Admin Dashboard at the top
    if (user?.role === "admin") {
        options.unshift({
            name: "Admin Dashboard", funcName: dashboard
        });
    }
    // Navigation functions
    function orders() {
        navigate("/orders/user");
    }
    function profile() {
        navigate("/profile");
    }
    function myCart() {
        navigate("/cart");
    }

    function handleLogout() {
        dispatch(logoutUser())
            .unwrap()
            .then(() => {
                toast.success('Logout Successfully', { position: "top-right", autoClose: 3000 });
                dispatch(removeSuccess());
                navigate("/login");
            })
            .catch((error) => {
                toast.error(error || "Logout failed", { position: "top-right", autoClose: 3000 });
            });
    }

    function dashboard() {
        navigate("/admin/dashboard");
    }
    return (
        <>
            <div className={`overlay ${menuVisible ? "show" : ""}`} onClick={toggleMenu}></div>
            <div className="dashboard-container">
                {/* Profile section */}
                <div className="profile-header" onClick={toggleMenu}>
                    <img
                        src={user?.avatar?.url || "./images/profile.jpg"}
                        alt="profile"
                        className="profile-avatar"
                    />
                    <span className="profile-name">{user?.name || "User"}</span>
                </div>

                {/* Menu buttons */}
                {menuVisible && (<div className="menu-options">
                    {options.map((item, index) => (
                        <button
                            key={index}
                            className={`menu-option-btn ${item.isCart ? (cartItems.length > 0 ? "cart-not-empty" : "") : ""}`}
                            onClick={item.funcName}
                        >
                            {item.name}
                        </button>
                    ))}
                </div>)}
            </div>
        </>

    );
}

export default UserDashboard;



