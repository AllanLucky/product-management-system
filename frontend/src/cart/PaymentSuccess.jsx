import React from "react";
import "../CartStyles/PaymentSuccess.css";
import { Link, useLocation } from "react-router-dom";

function PaymentSuccess() {
    const location = useLocation();
    const order = location.state?.order;

    return (
        <div className="payment-success-container">
            <div className="success-content">
                <div className="success-icon">
                    <div className="checkmark"></div>
                </div>

                <h1>Payment Successful!</h1>
                {order ? (
                    <p className="success-para">
                        You have successfully paid for <strong>{order.productName}</strong> — KES {order.amount}.
                    </p>
                ) : (
                    <p className="success-para">Thank you for your purchase. Your payment has been received.</p>
                )}

                <Link to="/" className="explore-btn">Go Home</Link>
            </div>
        </div>
    );
}

export default PaymentSuccess;
