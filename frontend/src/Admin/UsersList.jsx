import React, { useEffect, useState } from "react";
import "../AdminStyles/UsersList.css";
import PageTitle from "../components/PageTitle";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import { Delete, Edit } from "@mui/icons-material";
import { Link } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import {
    clearMessage,
    deleteUserProfile,
    fetchAllUsers,
    removeErrors,
} from "../features/admin/adminSlice";
import Loader from "../components/Loader";
import { toast } from "react-toastify";

function UsersList() {
    const { users, loading, error, message } = useSelector(
        (state) => state.admin
    );
    const dispatch = useDispatch();

    // Track which user is being deleted
    const [deletingUserId, setDeletingUserId] = useState(null);

    // Fetch all users on mount
    useEffect(() => {
        dispatch(fetchAllUsers());
    }, [dispatch]);

    // Show error messages
    useEffect(() => {
        if (error) {
            toast.error(error, { position: "top-right", autoClose: 3000 });
            dispatch(removeErrors());
        }
    }, [error, dispatch]);

    // Show success messages from slice
    useEffect(() => {
        if (message) {
            toast.success(message, { position: "top-right", autoClose: 3000 });
            dispatch(clearMessage());
        }
    }, [message, dispatch]);

    const handleDelete = async (id) => {
        const confirmDelete = window.confirm(
            "Are you sure you want to delete this user?"
        );
        if (!confirmDelete) return;

        setDeletingUserId(id);
        try {
            await dispatch(deleteUserProfile(id)).unwrap();
            toast.success("User deleted successfully", {
                position: "top-right",
                autoClose: 3000,
            });
            dispatch(fetchAllUsers()); // refresh list
        } catch (err) {
            toast.error(err || "Failed to delete user", {
                position: "top-right",
                autoClose: 3000,
            });
        } finally {
            setDeletingUserId(null);
        }
    };

    return (
        <>
            {loading ? (
                <Loader />
            ) : (
                <>
                    <PageTitle title="All Users" />
                    <Navbar />
                    <div className="usersList-container">
                        <h1 className="usersList-title">All Users</h1>
                        <div className="usersList-table-container">
                            <table className="usersList-table">
                                <thead>
                                    <tr>
                                        <th>SI No</th>
                                        <th>Name</th>
                                        <th>Email</th>
                                        <th>Role</th>
                                        <th>Created At</th>
                                        <th>Actions</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {users.length > 0 ? (
                                        users.map((user, index) => (
                                            <tr key={user._id}>
                                                <td>{index + 1}</td>
                                                <td>{user.name}</td>
                                                <td>{user.email}</td>
                                                <td>{user.role}</td>
                                                <td>
                                                    {new Date(
                                                        user.createdAt
                                                    ).toLocaleDateString()}
                                                </td>
                                                <td>
                                                    <Link
                                                        to={`/admin/user/${user._id}`}
                                                        className="action-icon edit-icon"
                                                    >
                                                        <Edit />
                                                    </Link>
                                                    <button
                                                        className="action-icon delete-icon"
                                                        onClick={() =>
                                                            handleDelete(
                                                                user._id
                                                            )
                                                        }
                                                        disabled={
                                                            deletingUserId ===
                                                            user._id
                                                        }
                                                    >
                                                        {deletingUserId ===
                                                            user._id ? (
                                                            <span className="spinner"></span>
                                                        ) : (
                                                            <Delete />
                                                        )}
                                                    </button>
                                                </td>
                                            </tr>
                                        ))
                                    ) : (
                                        <tr>
                                            <td
                                                colSpan="6"
                                                style={{
                                                    textAlign: "center",
                                                    padding: "20px",
                                                }}
                                            >
                                                No users found
                                            </td>
                                        </tr>
                                    )}
                                </tbody>
                            </table>
                        </div>
                    </div>
                    <Footer />
                </>
            )}
        </>
    );
}

export default UsersList;
