import React from 'react';
import '../CartStyles/OrderConfirm.css';
import PageTitle from '../components/PageTitle';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import { useSelector } from 'react-redux';
import CheckoutPath from './CheckoutPath';
import { useNavigate } from 'react-router-dom';
import { createSelector } from '@reduxjs/toolkit';

// Memoized selector to calculate totals
const selectCartTotals = createSelector(
    [(state) => state.cart.cartItems],
    (cartItems) => {
        const subtotal = cartItems?.reduce((acc, item) => acc + item.price * item.quantity, 0) || 0;
        const tax = subtotal * 0.16;
        let shippingCharges = 0;
        if (subtotal > 0 && subtotal < 500_000) shippingCharges = 50;
        else if (subtotal >= 500_000 && subtotal < 1_500_000) shippingCharges = subtotal * 0.01;
        else if (subtotal >= 1_500_000) shippingCharges = 0;
        const totalPrice = subtotal + tax + shippingCharges;

        return { subtotal, tax, shippingCharges, totalPrice };
    }
);

function OrderConfirm() {
    const { shippingInfo, cartItems } = useSelector((state) => state.cart);
    const { user } = useSelector((state) => state.user);
    const totals = useSelector(selectCartTotals);
    const navigate = useNavigate();

    // Format currency
    const formatCurrency = (amount) =>
        amount.toLocaleString('en-KE', {
            style: 'currency',
            currency: 'KES',
            minimumFractionDigits: 2,
            maximumFractionDigits: 2,
        });

    const proceedToPayment = () => {
        // Include phoneNumber and productName for payment
        const orderData = {
            ...totals,
            phoneNumber: shippingInfo?.phoneNumber || user?.phoneNumber || "",
            productName: cartItems.length === 1 ? cartItems[0].name : "Order Payment",
        };

        sessionStorage.setItem('orderItem', JSON.stringify(orderData));
        navigate('/process/payment');
    };

    return (
        <>
            <PageTitle title="Order Confirm" />
            <Navbar />
            <CheckoutPath activePath={1} />

            <div className="confirm-container">
                <h1 className="confirm-header">Order Confirmation</h1>

                {/* Shipping details */}
                <div className="confirm-table-container">
                    <table className="confirm-table">
                        <caption>Shipping Details</caption>
                        <thead>
                            <tr>
                                <th>Name</th>
                                <th>Phone Number</th>
                                <th>Address</th>
                            </tr>
                        </thead>
                        <tbody>
                            <tr>
                                <td>{user?.name || 'N/A'}</td>
                                <td>{shippingInfo?.phoneNumber || 'N/A'}</td>
                                <td>
                                    {shippingInfo
                                        ? `${shippingInfo.address}, ${shippingInfo.city}, ${shippingInfo.state}, ${shippingInfo.pinCode}, ${shippingInfo.country}`
                                        : 'N/A'}
                                </td>
                            </tr>
                        </tbody>
                    </table>
                </div>

                {/* Cart Items */}
                <div className="confirm-table-container">
                    <table className="confirm-table cart-table">
                        <caption>Cart Items</caption>
                        <thead>
                            <tr>
                                <th>Image</th>
                                <th>Product Name</th>
                                <th>Price</th>
                                <th>Quantity</th>
                                <th>Total Price</th>
                            </tr>
                        </thead>
                        <tbody>
                            {cartItems && cartItems.length > 0 ? (
                                cartItems.map((item, index) => (
                                    <tr key={index}>
                                        <td>
                                            {item.image ? (
                                                <img
                                                    src={item.image}
                                                    alt={item.name}
                                                    style={{ width: '50px', height: '50px', objectFit: 'cover' }}
                                                />
                                            ) : null}
                                        </td>
                                        <td>{item.name}</td>
                                        <td>{formatCurrency(item.price)}</td>
                                        <td>{item.quantity}</td>
                                        <td>{formatCurrency(item.price * item.quantity)}</td>
                                    </tr>
                                ))
                            ) : (
                                <tr>
                                    <td colSpan="5">No items in cart</td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>

                {/* Order Summary */}
                <div className="confirm-table-container">
                    <table className="confirm-table">
                        <caption>Order Summary</caption>
                        <thead>
                            <tr>
                                <th>Subtotal</th>
                                <th>Tax (16%)</th>
                                <th>Shipping</th>
                                <th>Total</th>
                            </tr>
                        </thead>
                        <tbody>
                            <tr>
                                <td>{formatCurrency(totals.subtotal)}</td>
                                <td>{formatCurrency(totals.tax)}</td>
                                <td>{formatCurrency(totals.shippingCharges)}</td>
                                <td>
                                    <strong>{formatCurrency(totals.totalPrice)}</strong>
                                </td>
                            </tr>
                        </tbody>
                    </table>
                </div>

                <button className="proceed-button" onClick={proceedToPayment}>
                    Proceed to Payment
                </button>
            </div>

            <Footer />
        </>
    );
}

export default OrderConfirm;
