import React from 'react';
import { useSelector } from 'react-redux';
import { Navigate } from 'react-router-dom';
import Loader from '../components/Loader'; // adjust path if needed

function ProtectedRoute({ element }) {
    const { isAuthenticated, loading } = useSelector(state => state.user);

    // Show loader while checking authentication
    if (loading) {
        return <Loader />;
    }

    // Redirect to login if not authenticated
    if (!isAuthenticated) {
        return <Navigate to="/login" />;
    }

    // If authenticated, render the passed element
    return element;
}

export default ProtectedRoute;
