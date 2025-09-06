import React, { useEffect } from "react";
import "../CartStyles/PaymentSuccess.css";
import { Link, useSearchParams } from "react-router-dom";
import PageTitle from "../components/PageTitle";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import { useSelector, useDispatch } from "react-redux";
import { toast } from "react-toastify";
import { createOrder, removeErrors, removeSuccess } from "../features/orders/orderSlice";
import { removeItemFromCartLocal } from "../features/cart/cartSlice"; 

function PaymentSuccess() {
    const [searchParams] = useSearchParams();
    const reference = searchParams.get("reference");

    const { cartItems, shippingInfo } = useSelector((state) => state.cart);
    const { loading, success, error, order } = useSelector((state) => state.order);
    const dispatch = useDispatch();

    useEffect(() => {
        const orderItem = JSON.parse(sessionStorage.getItem("orderItem"));

        const createOrderData = async () => {
            try {
                if (!orderItem) {
                    toast.error("No order details found.", { position: "top-right" });
                    return;
                }

                const orderData = {
                    shippingInfo: {
                        address: shippingInfo?.address,
                        city: shippingInfo?.city,
                        state: shippingInfo?.state,
                        country: shippingInfo?.country,
                        pinCode: shippingInfo?.pinCode,   // ✅ match schema
                        phoneNo: shippingInfo?.phoneNo,   // ✅ required
                    },
                    orderItems: cartItems.map((item) => ({
                        name: item.name,
                        price: item.price,
                        quantity: item.quantity,
                        image: item.image,    // ✅ required
                        product: item.product, // ✅ required
                    })),
                    paymentInfo: {
                        id: reference,        // ✅ required
                        status: "Paid",
                        paidAt: new Date(),   // ✅ required
                    },
                    itemPrice: orderItem.subtotal,
                    taxPrice: orderItem.tax,
                    shippingPrice: orderItem.shippingCharges,
                    totalPrice: orderItem.totalPrice,
                };

                console.log("Creating order with data:", orderData);
                dispatch(createOrder(orderData));
                sessionStorage.removeItem("orderItem");
            } catch (error) {
                toast.error(error.message || "Error creating order", {
                    position: "bottom-right",
                    autoClose: 3000,
                });
            }
        };

        createOrderData();
    }, [reference, dispatch, cartItems, shippingInfo]);

    useEffect(() => {
        if (success) {
            toast.success("Order created successfully!", {
                position: "top-right",
                autoClose: 3000,
            });

            // ✅ Clear cart when order is successful
            dispatch(removeItemFromCartLocal());

            dispatch(removeSuccess());
        }
    }, [dispatch, success]);

    useEffect(() => {
        if (error) {
            toast.error(error, {
                position: "top-right",
                autoClose: 3000,
            });
            dispatch(removeErrors());
        }
    }, [dispatch, error]);

    return (
        <>
            <PageTitle title="Payment Status" />
            <Navbar />
            <div className="payment-success-container">
                <div className="success-content">
                    {/* ✅ Loading State */}
                    {loading ? (
                        <div className="loading-spinner">
                            <p>Processing your order...</p>
                        </div>
                    ) : (
                        <>
                            {/* ✅ Success Check Icon */}
                            <div className="success-icon">
                                <div className="checkmark"></div>
                            </div>

                            <h1>Payment Successful!</h1>

                            {order ? (
                                <>
                                    <p className="success-para">
                                        You have successfully paid for{" "}
                                        <strong>{order.orderItems?.length || "your order"}</strong> —{" "}
                                        <strong>KES {order.totalPrice?.toLocaleString() || "0"}</strong>.
                                    </p>

                                    {/* ✅ Order Details */}
                                    <div className="order-details">
                                        <p><strong>Phone:</strong> {order.shippingInfo?.phoneNo}</p>
                                        <p><strong>Status:</strong> {order.paymentInfo?.status}</p>
                                        <p><strong>Transaction ID:</strong> {order.paymentInfo?.id}</p>
                                        <p><strong>Total:</strong> KES {order.totalPrice}</p>
                                    </div>
                                </>
                            ) : (
                                <p className="success-para">
                                    Thank you for your purchase. Your payment has been received.
                                </p>
                            )}

                            {/* ✅ CTA Buttons */}
                            <div className="payment-button-group">
                                <Link to="/" className="payment-go-back">
                                    Go Home
                                </Link>
                                <Link to="/orders/user" className="payment-btn payment-btn-secondary">
                                    View My Orders
                                </Link>
                            </div>
                        </>
                    )}
                </div>
            </div>
            <Footer />
        </>
    );
}

export default PaymentSuccess;
