import React, { useEffect } from 'react'
import Home from './pages/Home'
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import ProductDetails from './pages/ProductDetails';
import Products from './pages/Products';
import Register from './User/Register';
import Login from './User/Login';
import { useDispatch, useSelector } from 'react-redux';
import { loadUser } from './features/user/userSlice';
import UserDashboard from './User/userDashboard';
import Profile from './User/profile';
import ProtectedRoute from './components/ProtectedRoute';
import UpdateUserProfile from './User/UpdateUserProfile';

function App() {
  const { isAuthenticated, user } = useSelector((state) => state.user);
  const dispatch = useDispatch();

  // Load user on app start
  useEffect(() => {
    dispatch(loadUser());
  }, [dispatch]);

  // Log changes
  useEffect(() => {
    console.log("isAuthenticated:", isAuthenticated);
    console.log("user:", user);
  }, [isAuthenticated, user]);

  return (
    <Router>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/product/:id" element={<ProductDetails />} />
        <Route path="/products" element={<Products />} />
        <Route path="/products/:keyword" element={<Products />} />
        <Route path="/register" element={<Register />} />
        <Route path="/login" element={<Login />} />
        <Route path="/profile/update" element={<ProtectedRoute element={<UpdateUserProfile />} />} />
        <Route path="/profile" element={<ProtectedRoute element={<Profile />} />} />
      </Routes>

      {/* Show dashboard if authenticated */}
      {isAuthenticated && <UserDashboard />}
    </Router>
  );
}

export default App;


