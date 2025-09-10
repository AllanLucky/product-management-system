import React from 'react';
import '../AdminStyles/Dashboard.css';
import PageTitle from '../components/PageTitle';
import {
    AddBox,
    AttachMoney,
    CheckCircle,
    Dashboard as DashboardIcon,
    Inventory,
    People,
    ShoppingCart,
    Star,
    Error,
    Instagram,
    LinkedIn,
    YouTube
} from '@mui/icons-material';
import Navbar from '../components/Navbar';
import { Link } from 'react-router-dom';

function Dashboard() {
    return (
        <>
            <PageTitle title="Admin Dashboard" />
            <Navbar />

            <div className="dashboard-container">
                <div className="sidebar">
                    <div className="logo">
                        <DashboardIcon />
                        Dashboard
                    </div>
                    <div className="nav-menu">
                        <div className="nav-section">
                            <h3>Products</h3>
                            <Link to="/admin/products">
                                <Inventory className='nav-icon' />
                                All Products
                            </Link>
                            <Link to="/admin/product/create">
                                <AddBox className='nav-icon' />
                                Create Product
                            </Link>
                        </div>
                        <div className="nav-section">
                            <h3>Users</h3>
                            <Link to="/admin/users">
                                <People className='nav-icon' />
                                All Users
                            </Link>
                        </div>
                        <div className="nav-section">
                            <h3>Orders</h3>
                            <Link to="/admin/orders">
                                <ShoppingCart className='nav-icon' />
                                All Orders
                            </Link>
                        </div>
                        <div className="nav-section">
                            <h3>Reviews</h3>
                            <Link to="/admin/reviewId">
                                <Star className='nav-icon' />
                                All Reviews
                            </Link>
                        </div>
                    </div>
                </div>
            </div>

            <div className="main-content">
                <div className="stats-grid">
                    <div className="stat-box">
                        <Inventory className='icon' />
                        <h3>Total Products</h3>
                        <p>200</p>
                    </div>
                    <div className="stat-box">
                        <ShoppingCart className='icon' />
                        <h3>Total Orders</h3>
                        <p>800</p>
                    </div>
                    <div className="stat-box">
                        <Star className='icon' />
                        <h3>Total Reviews</h3>
                        <p>2000</p>
                    </div>
                    <div className="stat-box">
                        <AttachMoney className='icon' />
                        <h3>Total Revenue</h3>
                        <p>2700</p>
                    </div>
                    <div className="stat-box">
                        <Error className='icon' />
                        <h3>Out Of Stock</h3>
                        <p>2700</p>
                    </div>
                    <div className="stat-box">
                        <CheckCircle className='icon' />
                        <h3>In Stock</h3>
                        <p>400</p>
                    </div>
                    <div className="social-stats">
                        <div className="social-box instagram">
                            <Instagram />
                            <h3>Instagram</h3>
                            <p>5000 Followers</p>
                            <p>125 Posts</p>
                        </div>
                    </div>
                    <div className="social-box linkedin">
                        <LinkedIn />
                        <h3>LinkedIn</h3>
                        <p>500 Followers</p>
                        <p>325 Posts</p>
                    </div>
                    <div className="social-box youtube">
                        <YouTube />
                        <h3>YouTube</h3>
                        <p>500 Followers</p>
                        <p>325 Posts</p>
                    </div>
                </div>
            </div>
        </>
    );
}

export default Dashboard;
