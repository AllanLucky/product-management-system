import React, { useEffect, useState } from "react";
import "../CartStyles/Payment.css";
import { useParams, Link, useNavigate } from "react-router-dom";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import PageTitle from "../components/PageTitle";

function PaymentVerification() {
    const { checkoutId } = useParams();
    const [status, setStatus] = useState("loading"); // loading, success, failed, pending
    const navigate = useNavigate();

    useEffect(() => {
        const fetchStatus = async () => {
            try {
                const res = await fetch(`/api/v1/transaction/status/${checkoutId}`);
                const data = await res.json();

                if (data.status === "SUCCESS") {
                    // Redirect to success page with order reference
                    navigate("/payment-success", { state: { order: data.order } });
                } else if (data.status === "FAILED") {
                    setStatus("failed");
                } else if (data.status === "PENDING") {
                    setStatus("pending");
                } else {
                    setStatus("loading");
                }
            } catch (err) {
                console.error("Error fetching payment status:", err);
                setStatus("failed");
            }
        };

        const interval = setInterval(fetchStatus, 5000);
        fetchStatus();
        return () => clearInterval(interval);
    }, [checkoutId, navigate]);

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
