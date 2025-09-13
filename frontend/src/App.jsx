import React, { useEffect } from 'react'
import Home from './pages/Home'
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import ProductDetails from './pages/ProductDetails';
import Products from './pages/Products';
import Register from './User/Register';
import Login from './User/Login';
import { useDispatch, useSelector } from 'react-redux';
import { loadUser } from './features/user/userSlice';
import UserDashboard from './User/UserDashboard';
import Profile from './User/profile';
import ProtectedRoute from './components/ProtectedRoute';
import UpdateUserProfile from './User/UpdateUserProfile';
import UpdatePassword from './User/UpdatePassword';
import ForgotPassword from './User/ForgotPassword';
import ResetPassword from './User/ResetPassword';
import Cart from './cart/Cart';
import Shipping from './cart/Shipping';
import OrderConfirm from './cart/OrderConfirm';
import Payment from './cart/Payment';
import PaymentVerification from './cart/PaymentVerification';
import PaymentSuccess from './cart/PaymentSuccess';
import MyOrders from './Orders/MyOrders';
import OrderDetails from './Orders/OrderDetails';
import Dashboard from './Admin/Dashboard';
import ProductList from './Admin/ProductList';
import CreateProduct from './Admin/CreateProduct';
import UpdateProduct from './Admin/UpdateProduct';

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
        <Route path="/password/forgot" element={<ForgotPassword />} />
        <Route path="/reset/:token" element={<ResetPassword />} />
        <Route path="/cart" element={<Cart />} />

        {/* Protected routes */}
        <Route path="/shipping" element={<ProtectedRoute element={<Shipping />} />} />
        <Route path="/order/confirm" element={<ProtectedRoute element={<OrderConfirm />} />} />
        <Route path="/process/payment" element={<ProtectedRoute element={<Payment />} />} />
        <Route path="/payment/verify/:checkoutId" element={<ProtectedRoute element={<PaymentVerification />} />} />
        <Route path="/paymentSuccess" element={<ProtectedRoute element={<PaymentSuccess />} />} />
        <Route path="/orders/user" element={<ProtectedRoute element={<MyOrders />} />} />
        <Route path="/order/:id" element={<ProtectedRoute element={<OrderDetails />} />} />
        <Route path="/profile" element={<ProtectedRoute element={<Profile />} />} />
        <Route path="/profile/update" element={<ProtectedRoute element={<UpdateUserProfile />} />} />
        <Route path="/password/update" element={<ProtectedRoute element={<UpdatePassword />} />} />

        {/* Admin Dashboard route */}
        <Route path="/admin/dashboard" element={<ProtectedRoute element={<Dashboard />} adminOnly={true} />} />
        <Route path="/admin/products" element={<ProtectedRoute element={<ProductList />} adminOnly={true} />} />
        <Route path="/admin/product/create" element={<ProtectedRoute element={<CreateProduct />} adminOnly={true} />} />
        <Route path="/admin/product/:id" element={<ProtectedRoute element={<UpdateProduct />} adminOnly={true} />} />
      </Routes>

      {/* Show dashboard if authenticated */}
      {isAuthenticated && <UserDashboard />}
    </Router>
  );
}

export default App;
