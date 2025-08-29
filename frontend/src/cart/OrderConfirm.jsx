import React from 'react'
import '../CartStyles/OrderConfirm.css';
import PageTitle from '../components/PageTitle';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import { useSelector } from 'react-redux';
import CheckoutPath from './CheckoutPath';
import { useNavigate } from 'react-router-dom';

function OrderConfirm() {
    const { shippingInfo, cartItems } = useSelector(state => state.cart);
    const { user } = useSelector(state => state.user);
    const navigate = useNavigate();

    // Calculate subtotal
    const subtotal = cartItems?.reduce((acc, item) => acc + item.price * item.quantity, 0) || 0;

    // Tax (18%)
    const tax = subtotal * 0.16;

    // Shipping logic
    let shippingCharges = 0;
    if (subtotal > 0 && subtotal < 500_000) {
        shippingCharges = 50;
    } else if (subtotal >= 500_000 && subtotal < 1_500_000) {
        shippingCharges = subtotal * 0.01;
    } else if (subtotal >= 1_500_000) {
        shippingCharges = 0;
    }

    // Final total
    const totalPrice = subtotal + tax + shippingCharges;

    // Format currency
    const formatCurrency = (amount) =>
        amount.toLocaleString('en-KE', {
            style: 'currency',
            currency: 'KES',
            minimumFractionDigits: 2,
            maximumFractionDigits: 2
        });

    const proceedToPayment = () => {
        const data = {
            subtotal,
            tax,
            shippingCharges,
            totalPrice
        }
        sessionStorage.setItem("orderItem", JSON.stringify(data)); // ✅ fixed typo
        navigate("/process/payment"); // ✅ no spaces in path
    }

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
                                <td>{user?.name}</td>
                                <td>{shippingInfo?.phoneNumber}</td>
                                <td>
                                    {shippingInfo?.address}, {shippingInfo?.city}, {shippingInfo?.state}, {shippingInfo?.pinCode}, {shippingInfo?.country}
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
                                <>
                                    {cartItems.map((item, index) => (
                                        <tr key={index}>
                                            <td>
                                                <img
                                                    src={item.image}
                                                    alt={item.name}
                                                    style={{ width: "50px", height: "50px", objectFit: "cover" }}
                                                />
                                            </td>
                                            <td>{item.name}</td>
                                            <td>{formatCurrency(item.price)}</td>
                                            <td>{item.quantity}</td>
                                            <td>{formatCurrency(item.price * item.quantity)}</td>
                                        </tr>
                                    ))}
                                </>
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
                                <td>{formatCurrency(subtotal)}</td>
                                <td>{formatCurrency(tax)}</td>
                                <td>{formatCurrency(shippingCharges)}</td> {/* ✅ fixed */}
                                <td><strong>{formatCurrency(totalPrice)}</strong></td>
                            </tr>
                        </tbody>
                    </table>
                </div>

                <button className="proceed-button" onClick={proceedToPayment}>Proceed to Payment</button>
            </div>

            <Footer />
        </>
    )
}

export default OrderConfirm;
