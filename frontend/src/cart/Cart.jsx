import React, { useEffect } from 'react';
import '../CartStyles/Cart.css';
import PageTitle from '../components/PageTitle';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import CartItem from './CartItem';
import { useSelector, useDispatch } from 'react-redux';
import { toast } from 'react-toastify';
import { removeErrors, removeMessage } from '../features/cart/cartSlice';
import { Link, useNavigate } from 'react-router-dom';

function Cart() {
    const dispatch = useDispatch();
    const { cartItems, error, message } = useSelector(state => state.cart);

    // Toast messages
    useEffect(() => {
        if (error) {
            toast.error(error, { position: "top-right", autoClose: 3000 });
            dispatch(removeErrors());
        }
        if (message) {
            toast.success(message, { position: "top-right", autoClose: 3000 });
            dispatch(removeMessage());
        }
    }, [error, message, dispatch]);

    // Totals
    const subtotal = cartItems.reduce((acc, item) => acc + item.price * item.quantity, 0);
    const tax = subtotal * 0.16;

    let shipping = 0;
    if (subtotal > 0 && subtotal < 500_000) {
        shipping = 50;
    } else if (subtotal >= 500_000 && subtotal < 1_500_000) {
        shipping = subtotal * 0.01;
    } else if (subtotal >= 1_500_000) {
        shipping = 0;
    }

    const total = subtotal + tax + shipping;

    const formatCurrency = (amount) =>
        amount.toLocaleString('en-KE', {
            style: 'currency',
            currency: 'KES',
            minimumFractionDigits: 2,
            maximumFractionDigits: 2
        });

    const navigate = useNavigate();
    const checkoutHandler = () => {
        navigate(`/login?redirect=/shipping`);
    };

    return (
        <>
            <PageTitle title="Your Cart" />
            <Navbar />
            {cartItems.length === 0 ? (
                <div className="empty-cart-container">
                    <p className="empty-cart-message">Your Cart is empty</p>
                    <Link to="/products" className="viewProducts">View Products</Link>
                </div>
            ) : (
                <>
                    <div className="cart-page">
                        <div className="cart-items">
                            <div className="cart-items-heading">Your Cart</div>
                            <div className="cart-table">
                                <div className="cart-table-header">
                                    <div className="header-product">Product</div>
                                    <div className="header-quantity">Quantity</div>
                                    <div className="header-total item-total-heading">Item Total</div>
                                    <div className="header-action">Actions</div>
                                </div>

                                {cartItems.map((item) => (
                                    <CartItem key={item._id} item={item} />
                                ))}
                            </div>
                        </div>

                        {/* Price Summary */}
                        <div className="price-summary">
                            <h3 className="price-summary-heading">Price Summary</h3>
                            <div className="summary-item">
                                <p className="summary-label">Subtotal</p>
                                <p className="summary-value">{formatCurrency(subtotal)}</p>
                            </div>
                            <div className="summary-item">
                                <p className="summary-label">Tax (16%)</p>
                                <p className="summary-value">{formatCurrency(tax)}</p>
                            </div>
                            <div className="summary-item">
                                <p className="summary-label">Shipping</p>
                                <p className="summary-value">{formatCurrency(shipping)}</p>
                            </div>
                            <div className="summary-total">
                                <p className="total-label">Total</p>
                                <p className="total-value">{formatCurrency(total)}</p>
                            </div>
                            <button className="checkout-btn" onClick={checkoutHandler} disabled={cartItems.length === 0}>
                                Proceed to checkout
                            </button>
                        </div>
                    </div>
                </>
            )}
            <Footer />
        </>
    );
}

export default Cart;


