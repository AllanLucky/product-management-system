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
                    <>
                        <p className="success-para">
                            You have successfully paid for{" "}
                            <strong>{order.productName}</strong> —{" "}
                            <strong>KES {order.amount}</strong>.
                        </p>
                        <div className="order-details">
                            {order.phoneNumber && (
                                <p><strong>Phone:</strong> {order.phoneNumber}</p>
                            )}
                            {order.status && (
                                <p><strong>Status:</strong> {order.status}</p>
                            )}
                            {order.transactionId && (
                                <p><strong>Transaction ID:</strong> {order.transactionId}</p>
                            )}
                            {order.receiptPath && (
                                <p>
                                    <strong>Receipt: </strong>
                                    <a
                                        href={order.receiptPath}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        className="explore-btn"
                                    >
                                        Download PDF
                                    </a>
                                </p>
                            )}
                        </div>
                    </>
                ) : (
                    <p className="success-para">
                        Thank you for your purchase. Your payment has been received.
                    </p>
                )}

                <Link to="/" className="explore-btn">Go Home</Link>
            </div>
        </div>
    );
}

export default PaymentSuccess;
