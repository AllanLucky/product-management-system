import React, { useEffect, useState } from 'react';
import '../AdminStyles/UpdateOrder.css';
import PageTitle from '../components/PageTitle';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import { useParams } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { getOrderDetails } from '../features/orders/orderSlice';

function UpdateOrderStatus() {
    const [status, setStatus] = useState("");
    const { id } = useParams();
    const dispatch = useDispatch();
    const { orderDetails: order, loading, error } = useSelector(state => state.order);

    useEffect(() => {
        if (id) {
            dispatch(getOrderDetails(id));
        }
    }, [dispatch, id]);

    const {
        shippingInfo = {},
        orderItems = [],
        paymentInfo = {},
        orderStatus,
        totalPrice
    } = order || {};

    return (
        <>
            <PageTitle title="Update Order" />
            <Navbar />

            <div className="order-container">
                <h1 className="order-title">Update Order</h1>

                {loading && <p>Loading order details...</p>}
                {error && <p className="error">{error}</p>}

                {!loading && !error && order && (
                    <>
                        <div className="order-details">
                            <h2>Order Summary</h2>
                            <p>Order ID: <strong>{id}</strong></p>
                            <p>
                                Shipping Address:
                                <strong>
                                    {shippingInfo?.address
                                        ? `${shippingInfo.address}, ${shippingInfo.city}, ${shippingInfo.state}, ${shippingInfo.pinCode}, ${shippingInfo.country}`
                                        : 'N/A'}
                                </strong>
                            </p>
                            <p>Phone No: <strong>{shippingInfo?.phoneNumber || 'N/A'}</strong></p>
                            <p>Order Status: <strong>{orderStatus || 'N/A'}</strong></p>
                            <p>Payment Status: <strong>{paymentInfo?.status || 'N/A'}</strong></p>
                            <p>Total Price: <strong>{totalPrice || 0}</strong></p>
                        </div>

                        <div className="order-items">
                            <h2>Order Items</h2>
                            <table className="order-table">
                                <thead>
                                    <tr>
                                        <th>Image</th>
                                        <th>Name</th>
                                        <th>Quantity</th>
                                        <th>Price</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {orderItems.length > 0 ? (
                                        orderItems.map((item, index) => (
                                            <tr key={index}>
                                                <td>
                                                    <img
                                                        src={item.image}
                                                        alt={item.name}
                                                        className="order-item-image"
                                                    />
                                                </td>
                                                <td>{item.name}</td>
                                                <td>{item.quantity}</td>
                                                <td>{item.price}</td>
                                            </tr>
                                        ))
                                    ) : (
                                        <tr>
                                            <td colSpan="4">No items in this order.</td>
                                        </tr>
                                    )}
                                </tbody>
                            </table>
                        </div>

                        <div className="order-status">
                            <h2>Update Status</h2>
                            <select
                                className="status-select"
                                value={status}
                                onChange={(e) => setStatus(e.target.value)}
                            >
                                <option value="">Select Status</option>
                                <option value="Shipped">Shipped</option>
                                <option value="On The Way">On The Way</option>
                                <option value="Delivered">Delivered</option>
                            </select>
                            <button className="update-button">Update Status</button>
                        </div>
                    </>
                )}
            </div>

            <Footer />
        </>
    );
}

export default UpdateOrderStatus;
