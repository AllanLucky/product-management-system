import React from "react";
import "../CartStyles/Payment.css";
import PageTitle from "../components/PageTitle";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import CheckoutPath from "./CheckoutPath";
import { Link } from "react-router-dom";
import axios from "axios";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

function Payment() {
    const orderItem = JSON.parse(sessionStorage.getItem("orderItem")) || { totalPrice: 0 };

    const handlePayment = async () => {
        try {
            const response = await axios.post("http://localhost:8000/api/v1/transactions", {
                amount: orderItem.totalPrice,
                description: "Order payment",
                paymentMethod: "mpesa"
            });

            if (response.data.success) {
                toast.success("Payment successful!");
                // Optionally redirect after a short delay
                setTimeout(() => window.location.href = "/order/confirm", 2000);
            } else {
                toast.error("Payment failed, please try again.");
            }
        } catch (error) {
            console.error("Payment error:", error);
            toast.error("Something went wrong. Try again.");
        }
    };

    return (
        <>
            <Navbar />
            <main className="payment-main">
                <PageTitle title="Payment Processing" />
                <CheckoutPath activePath={2} />

                <div className="payment-container">
                    <Link to="/order/confirm" className="payment-go-back">
                        Back
                    </Link>
                    <button className="payment-btn" onClick={handlePayment}>
                        Make Payment (KES {orderItem.totalPrice})
                    </button>
                </div>
            </main>
            <Footer />
            <ToastContainer position="top-right" autoClose={3000} />
        </>
    );
}

export default Payment;
