import React, { useEffect, useState } from 'react';
import '../AdminStyles/UpdateOrder.css';
import PageTitle from '../components/PageTitle';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import { useParams } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { getOrderDetails } from '../features/orders/orderSlice';
import { removeErrors, removeSuccess, updatingOrder } from '../features/admin/adminSlice';
import { toast } from 'react-toastify';
import Loader from '../components/Loader';

function UpdateOrderStatus() {
    const [status, setStatus] = useState("");
    const { id } = useParams();
    const dispatch = useDispatch();

    const { orderDetails: order, loading: orderLoading } = useSelector(state => state.order);
    const { success, loading: adminLoading, error } = useSelector(state => state.admin);

    const loading = orderLoading || adminLoading;

    useEffect(() => {
        if (id) {
            dispatch(getOrderDetails(id));
        }
    }, [dispatch, id]);

    useEffect(() => {
        if (success) {
            toast.success("Order status updated successfully!", { autoClose: 3000 });
            dispatch(removeSuccess());
            dispatch(getOrderDetails(id));
        }
        if (error) {
            toast.error(error, { autoClose: 3000 });
            dispatch(removeErrors());
            dispatch(getOrderDetails(id));
        }
    }, [success, error, dispatch, id]);

    const {
        shippingInfo = {},
        orderItems = [],
        paymentInfo = {},
        orderStatus,
        totalPrice
    } = order || {};

    const paymentStatus = paymentInfo.status === "succeeded" ? "Paid" : "Not Paid";
    const finalOrderStatus = orderStatus || "N/A"; // ✅ no auto-cancel override

    const handleStatusUpdate = () => {
        if (!status) {
            toast.error("Please select the status", { autoClose: 3000 });
            return;
        }
        dispatch(updatingOrder({ id, status }));
    };

    return (
        <>
            <PageTitle title="Update Order" />
            <Navbar />

            <div className="order-container">
                <h1 className="order-title">Update Order</h1>

                {loading ? (
                    <Loader />
                ) : (
                    <>
                        <div className="order-details">
                            <h2>Order Summary</h2>
                            <p>Order ID: <strong>{id}</strong></p>
                            <p>
                                Shipping Address:{" "}
                                <strong>
                                    {shippingInfo?.address
                                        ? `${shippingInfo.address}, ${shippingInfo.city}, ${shippingInfo.state}, ${shippingInfo.pinCode}, ${shippingInfo.country}`
                                        : "N/A"}
                                </strong>
                            </p>
                            <p>Phone No: <strong>{shippingInfo?.phoneNumber || "N/A"}</strong></p>
                            <p>Order Status: <strong>{finalOrderStatus}</strong></p>
                            <p>Payment Status: <strong>{paymentStatus}</strong></p>
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
                                disabled={finalOrderStatus === "Delivered"} // ✅ only lock if Delivered
                            >
                                <option value="">Select Status</option>
                                <option value="Shipped">Shipped</option>
                                <option value="On The Way">On The Way</option>
                                <option value="Delivered">Delivered</option>
                            </select>
                            <button
                                className="update-button"
                                onClick={handleStatusUpdate}
                                disabled={loading || !status || finalOrderStatus === "Delivered"} // ✅ block button if Delivered
                            >
                                {loading ? "Updating..." : "Update Status"}
                            </button>

                            {finalOrderStatus === "Delivered" && (
                                <p className="delivered-note">
                                    ✅ This order has already been delivered and cannot be updated.
                                </p>
                            )}
                        </div>
                    </>
                )}
            </div>

            <Footer />
        </>
    );
}

export default UpdateOrderStatus;
