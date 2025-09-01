import React, { useState, useEffect } from "react";
import "../CartStyles/Payment.css";
import PageTitle from "../components/PageTitle";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import CheckoutPath from "./CheckoutPath";
import { Link, useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { initiatePayment, removeErrors } from "../features/transaction/transactionSlice";

function Payment() {
    const dispatch = useDispatch();
    const navigate = useNavigate();

    const orderItem = JSON.parse(sessionStorage.getItem("orderItem")) || {
        totalPrice: 0,
        productName: "Order Payment",
        phoneNumber: ""
    };

    const { user } = useSelector((state) => state.user || {});
    const [phoneNumber, setPhoneNumber] = useState(orderItem.phoneNumber || user?.phoneNumber || "");

    const { status = "idle", error = null } = useSelector(
        (state) => state.transaction || {}
    );

    useEffect(() => {
        return () => dispatch(removeErrors());
    }, [dispatch]);

    const handlePayment = async () => {
        let formattedPhone = phoneNumber;

        if (formattedPhone.startsWith("0")) {
            formattedPhone = `254${formattedPhone.slice(1)}`;
        } else if (formattedPhone.startsWith("+")) {
            formattedPhone = formattedPhone.slice(1);
        }

        if (!formattedPhone || !orderItem.totalPrice || !orderItem.productName) {
            toast.error("Phone number, amount, and product name are required.");
            return;
        }

        try {
            const resultAction = await dispatch(
                initiatePayment({
                    phoneNumber: formattedPhone,
                    amount: orderItem.totalPrice,
                    productName: orderItem.productName,
                    customDesc: `Payment for ${orderItem.productName}`,
                })
            );

            if (initiatePayment.fulfilled.match(resultAction)) {
                toast.success(
                    resultAction.payload?.message ||
                    "Your M-Pesa payment request has been successfully initiated. Check your phone."
                );

                // Redirect user to payment verification page
                const checkoutId = resultAction.payload.order.checkoutRequestId;
                navigate(`/payment/verify/${checkoutId}`);
            } else {
                toast.error(
                    resultAction.payload?.message ||
                    "Transaction failed or was cancelled. Please try again."
                );
            }
        } catch (err) {
            console.error("Payment error:", err);
            toast.error("Something went wrong. Please try again.");
        }
    };

    return (
        <>
            <Navbar />
            <main className="payment-main">
                <PageTitle title="Payment Processing" />
                <CheckoutPath activePath={2} />

                <div className="payment-container">
                    <div className="payment-row">
                        <input
                            type="tel"
                            placeholder="Enter phone number"
                            value={phoneNumber}
                            onChange={(e) => setPhoneNumber(e.target.value)}
                            className="payment-phone-input"
                        />
                        <Link to="/cart" className="payment-go-back">
                            Back
                        </Link>
                        <button
                            className="payment-btn"
                            onClick={handlePayment}
                            disabled={status === "loading"}
                        >
                            {status === "loading"
                                ? "Processing..."
                                : `Make Payment (KES ${orderItem.totalPrice})`}
                        </button>
                    </div>

                    {error && <p className="payment-error">{error}</p>}
                </div>
            </main>
            <Footer />
            <ToastContainer position="top-right" autoClose={3000} />
        </>
    );
}

export default Payment;
