import React from 'react';
import { useSelector } from 'react-redux';
import { Navigate } from 'react-router-dom';
import Loader from '../components/Loader'; // adjust path if needed

function ProtectedRoute({ element, adminOnly = false }) {
    const { isAuthenticated, loading, user } = useSelector(state => state.user);

    // Show loader while checking authentication
    if (loading) {
        return <Loader />;
    }

    // Redirect to login if not authenticated
    if (!isAuthenticated) {
        return <Navigate to="/login" />;
    }

    // Restrict admin-only routes
    if (adminOnly && user?.role !== 'admin') {
        return <Navigate to="/" />;
    }

    // If authenticated, render the passed element
    return element;
}

export default ProtectedRoute;

