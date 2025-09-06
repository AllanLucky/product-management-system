import React, { useEffect } from 'react';
import '../OrderStyles/OrderDetails.css';
import PageTitle from '../components/PageTitle';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import { useParams } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { getOrderDetails, removeErrors } from '../features/orders/orderSlice';
import { toast } from 'react-toastify';
import Loader from '../components/Loader';

function OrderDetails() {
    const { id } = useParams();
    const dispatch = useDispatch();

    // Use orderDetails from the slice
    const { orderDetails: order, loading, error } = useSelector((state) => state.order);

    useEffect(() => {
        dispatch(getOrderDetails(id));
    }, [dispatch, id]);

    useEffect(() => {
        if (error) {
            toast.error(error, { position: "top-right", autoClose: 3000 });
            dispatch(removeErrors());
        }
    }, [error, dispatch]);

    if (!order) return null;

    const {
        shippingInfo = {},
        orderItems = [],
        paymentInfo = {},
        orderStatus = "Processing",
        totalPrice = 0,
        taxPrice = 0,
        itemPrice = 0,
        shippingPrice = 0,
        paidAt = ""
    } = order;

    const formatStatusClass = (status) => status?.toLowerCase().replace(/\s+/g, "-");

    const finalOrderStatus = orderStatus === "Not Paid" ? "Cancelled" : orderStatus;
    const paymentStatus = paymentInfo?.status === "succeeded" ? "Paid" : "Not Paid";

    return (
        <>
            <PageTitle title="Order Details" />
            <Navbar />
            {loading ? (
                <Loader />
            ) : (
                <div className="order-box">
                    {/* Order Items */}
                    <div className="table-block">
                        <h2 className="table-title">Order Items</h2>
                        <table className="table-main">
                            <thead>
                                <tr>
                                    <th className="head-cell">Image</th>
                                    <th className="head-cell">Name</th>
                                    <th className="head-cell">Quantity</th>
                                    <th className="head-cell">Price</th>
                                </tr>
                            </thead>
                            <tbody>
                                {orderItems.length > 0 ? orderItems.map(item => (
                                    <tr className="table-row" key={item._id || item.name}>
                                        <td className="table-cell">
                                            <img src={item.image || ""} alt={item.name} className="item-img" />
                                        </td>
                                        <td className="table-cell">{item.name}</td>
                                        <td className="table-cell">{item.quantity}</td>
                                        <td className="table-cell">KES {item.price.toFixed(2)}</td>
                                    </tr>
                                )) : (
                                    <tr className="table-row">
                                        <td className="table-cell" colSpan="4">No items found</td>
                                    </tr>
                                )}
                            </tbody>
                        </table>
                    </div>

                    {/* Shipping Info */}
                    <div className="table-block">
                        <h2 className="table-title">Shipping Info</h2>
                        <table className="table-main">
                            <tbody>
                                <tr className="table-row">
                                    <th className="table-cell">Address</th>
                                    <td className="table-cell">
                                        {shippingInfo.address || "-"}, {shippingInfo.city || "-"}, {shippingInfo.state || "-"}, {shippingInfo.country || "-"}, {shippingInfo.pinCode || "-"}
                                    </td>
                                </tr>
                                <tr className="table-row">
                                    <th className="table-cell">Phone</th>
                                    <td className="table-cell">{shippingInfo.phoneNo || "-"}</td>
                                </tr>
                            </tbody>
                        </table>
                    </div>

                    {/* Order Summary */}
                    <div className="table-block">
                        <h2 className="table-title">Order Summary</h2>
                        <table className="table-main">
                            <tbody>
                                <tr className="table-row">
                                    <th className="table-cell">Order Status</th>
                                    <td className="table-cell">
                                        <span className={`status-tag ${formatStatusClass(finalOrderStatus)}`}>{finalOrderStatus}</span>
                                    </td>
                                </tr>
                                <tr className="table-row">
                                    <th className="table-cell">Payment Status</th>
                                    <td className="table-cell">
                                        <span className={`pay-tag ${formatStatusClass(paymentStatus)}`}>{paymentStatus}</span>
                                    </td>
                                </tr>
                                <tr className="table-row">
                                    <th className="table-cell">Paid At</th>
                                    <td className="table-cell">{paidAt ? new Date(paidAt).toLocaleString() : "N/A"}</td>
                                </tr>
                                <tr className="table-row">
                                    <th className="table-cell">Item Price</th>
                                    <td className="table-cell">KES {itemPrice.toFixed(2)}</td>
                                </tr>
                                <tr className="table-row">
                                    <th className="table-cell">Tax Price</th>
                                    <td className="table-cell">KES {taxPrice.toFixed(2)}</td>
                                </tr>
                                <tr className="table-row">
                                    <th className="table-cell">Shipping Price</th>
                                    <td className="table-cell">KES {shippingPrice.toFixed(2)}</td>
                                </tr>
                                <tr className="table-row">
                                    <th className="table-cell">Total Price</th>
                                    <td className="table-cell">KES {totalPrice.toFixed(2)}</td>
                                </tr>
                            </tbody>
                        </table>
                    </div>
                </div>
            )}
            <Footer />
        </>
    );
}

export default OrderDetails;
