import React, { useEffect } from 'react';
import '../OrderStyles/MyOrders.css';
import PageTitle from '../components/PageTitle';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import { Link } from 'react-router-dom';
import { LaunchOutlined } from '@mui/icons-material';
import { useDispatch, useSelector } from 'react-redux';
import { getAllMyOrders, removeErrors } from '../features/orders/orderSlice';
import { toast } from 'react-toastify';
import Loader from '../components/Loader';

function MyOrders() {
    const dispatch = useDispatch();
    const { orders, loading, error } = useSelector((state) => state.order);

    useEffect(() => {
        dispatch(getAllMyOrders());

        if (error) {
            toast.error(error, {
                position: "top-right",
                autoClose: 3000
            });
            dispatch(removeErrors());
        }
    }, [dispatch, error]);

    return (
        <>
            <PageTitle title="My Orders" />
            <Navbar />

            {loading ? (
                <Loader />
            ) : orders && orders.length > 0 ? (
                <div className="my-orders-container">
                    <h1>My Orders</h1>
                    <div className="table-responsive">
                        <table className="orders-table">
                            <thead>
                                <tr>
                                    <th>Order ID</th>
                                    <th>Status</th>
                                    <th>Items Count</th>
                                    <th>Total Price</th>
                                    <th>View Order</th>
                                </tr>
                            </thead>
                            <tbody>
                                {orders.map((order) => (
                                    <tr key={order._id}>
                                        <td>{order._id}</td>
                                        <td>{order.orderStatus}</td>
                                        <td>{order.orderItems.length}</td>
                                        <td>KES {order.totalPrice.toLocaleString()}</td>
                                        <td>
                                            <Link to={`/order/${order._id}`} className="view-order-link">
                                                <LaunchOutlined />
                                            </Link>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </div>
            ) : (
                <div className="no-orders">
                    <p className="no-order-message">
                        You have no orders yet. <Link to="/products">Shop now!</Link>
                    </p>
                </div>
            )}

            <Footer />
        </>
    );
}

export default MyOrders;
