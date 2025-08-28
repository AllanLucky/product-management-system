import React from "react";
import "../CartStyles/Payment.css";
import PageTitle from "../components/PageTitle";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import CheckoutPath from "./CheckoutPath";
import { Link } from "react-router-dom";

function Payment() {
    const orderItem = JSON.parse(sessionStorage.getItem("orderItem")) || { totalPrice: 0 };

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
                    <button className="payment-btn">
                        Make Payment (KES {orderItem.totalPrice})
                    </button>
                </div>
            </main>
            <Footer />
        </>
    );
}

export default Payment;
