import React, { useEffect, useState } from "react";
import "../CartStyles/Payment.css";
import { useParams, Link } from "react-router-dom";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import PageTitle from "../components/PageTitle";

function PaymentVerification() {
    const { checkoutId } = useParams();
    const [status, setStatus] = useState("loading"); // loading, success, failed, pending
    const [order, setOrder] = useState(null);

    useEffect(() => {
        const fetchStatus = async () => {
            try {
                const res = await fetch(`/api/v1/transaction/status/${checkoutId}`);
                const data = await res.json();

                if (data.status === "SUCCESS") {
                    setStatus("success");
                    setOrder(data.order);
                } else if (data.status === "FAILED") {
                    setStatus("failed");
                    setOrder(data.order);
                } else {
                    setStatus("pending");
                }
            } catch (err) {
                console.error("Error fetching payment status:", err);
                setStatus("failed");
            }
        };

        const interval = setInterval(fetchStatus, 5000);
        fetchStatus();
        return () => clearInterval(interval);
    }, [checkoutId]);

    return (
        <>
            <Navbar />
            <main className="payment-main" style={{ paddingTop: "4rem" }}>
                <PageTitle title="Payment Verification" />

                <div className="payment-container">
                    {status === "loading" && (
                        <p className="payment-pending">
                            <span className="rotating-icon">⏳</span> Checking payment status...
                        </p>
                    )}
                    {status === "pending" && (
                        <p className="payment-pending">
                            <span className="rotating-icon">⏳</span> Payment is pending. Please complete it on your phone.
                        </p>
                    )}
                    {status === "success" && order && (
                        <div className="payment-success-card">
                            <p className="payment-success">✅ Payment Successful!</p>
                            <div className="payment-details">
                                <p><strong>Product:</strong> {order.productName}</p>
                                <p><strong>Amount:</strong> KES {order.amount}</p>
                                <p><strong>Phone:</strong> {order.phoneNumber}</p>
                                <p><strong>Status:</strong> {order.status}</p>
                                {order.receiptPath && (
                                    <p>
                                        <strong>Receipt:</strong>{" "}
                                        <a
                                            href={order.receiptPath}
                                            target="_blank"
                                            rel="noopener noreferrer"
                                            className="payment-go-back"
                                        >
                                            Download PDF
                                        </a>
                                    </p>
                                )}
                            </div>
                            <Link to="/" className="payment-btn">Go Home</Link>
                        </div>
                    )}
                    {status === "failed" && (
                        <p className="payment-failed">❌ Payment failed or was cancelled.</p>
                    )}
                    <Link to="/cart" className="payment-go-back">Back to Cart</Link>
                </div>
            </main>
            <Footer />
        </>
    );
}

export default PaymentVerification;
