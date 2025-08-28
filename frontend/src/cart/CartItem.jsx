import React, { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import {
    addItemToCart,
    removeItemFromCart
} from '../features/cart/cartSlice';
import '../CartStyles/Cart.css';
import { toast } from 'react-toastify';

function CartItem({ item }) {
    const dispatch = useDispatch();
    const { loading } = useSelector((state) => state.cart);

    const [quantity, setQuantity] = useState(item.quantity || 1);

    // ✅ Increment
    const increment = () => {
        if (quantity < item.stock) {
            setQuantity(quantity + 1);
        } else {
            toast.error("Cannot exceed stock quantity!", {
                position: "top-right",
                autoClose: 3000
            });
        }
    };

    // ✅ Decrement
    const decrement = () => {
        if (quantity > 1) {
            setQuantity(quantity - 1);
        } else {
            toast.error("Quantity cannot be less than 1!", {
                position: "top-right",
                autoClose: 3000
            });
        }
    };

    const updateItem = () => {
        if (loading) return;
        if (quantity !== item.quantity) {
            dispatch(addItemToCart({ id: item.id, quantity }));
        }
    };

    const removeItem = () => {
        if (loading) return; // prevent double clicks while loading
        dispatch(removeItemFromCart(item.id));
    };

    const highlightClass = quantity !== item.quantity ? 'item-updated' : '';

    return (
        <div className={`cart-item ${highlightClass}`}>
            <div className="item-info">
                <img
                    src={item.image || "/images/hp-laptop.webp"}
                    alt={item.name || "Product"}
                    className="item-image"
                />
                <div className="item-details">
                    <h3 className="item-name">{item.name || "Unnamed Product"}</h3>
                    <p className="item-price"><strong>Price:</strong> {item.price || 0}</p>
                    <p className="item-price"><strong>Quantity:</strong> {quantity}</p>
                </div>
            </div>

            <div className="quantity-controls">
                <button className="quantity-button decrease-btn" onClick={decrement}>-</button>
                <input type="number" value={quantity} className="quantity-input" readOnly min={1} />
                <button className="quantity-button increase-btn" onClick={increment}>+</button>
            </div>

            <div className="item-total">
                <span className="item-total-price">{(item.price * quantity).toFixed(2)}</span>
            </div>

            <div className="item-actions">
                <button
                    className="update-item-btn"
                    onClick={updateItem}
                    disabled={loading || quantity === item.quantity}
                >
                    {loading ? "Updating..." : "Update"}
                </button>
                <button
                    className="remove-item-btn"
                    onClick={removeItem}
                    disabled={loading}
                >
                    {loading ? "Removing..." : "Remove"}
                </button>
            </div>
        </div>
    );
}

export default CartItem;
