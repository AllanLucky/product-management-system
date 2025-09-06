import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { addItemToCart, removeItemFromCart } from '../features/cart/cartSlice';
import '../CartStyles/Cart.css';
import { toast } from 'react-toastify';

function CartItem({ item }) {
    const dispatch = useDispatch();
    const { loading } = useSelector((state) => state.cart);

    const [quantity, setQuantity] = useState(item.quantity || 1);

    // Sync local quantity with store in case it changes externally
    useEffect(() => {
        setQuantity(item.quantity || 1);
    }, [item.quantity]);

    // Increment quantity with stock limit
    const increment = () => {
        if (quantity < item.stock) {
            setQuantity(quantity + 1);
        } else {
            toast.error("Cannot exceed stock quantity!", { position: "top-right", autoClose: 3000 });
        }
    };

    // Decrement quantity with minimum limit
    const decrement = () => {
        if (quantity > 1) {
            setQuantity(quantity - 1);
        } else {
            toast.error("Quantity cannot be less than 1!", { position: "top-right", autoClose: 3000 });
        }
    };

    // Dispatch updated quantity to store
    const updateItem = () => {
        if (loading) return;
        if (quantity !== item.quantity) {
            dispatch(addItemToCart({ id: item.id, quantity }));
        }
    };

    // Remove item from cart
    const removeItem = () => {
        if (loading) return;
        dispatch(removeItemFromCart(item.id));
    };

    // Highlight item if quantity changed locally
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
                    <p className="item-price"><strong>Price:</strong> {item.price?.toFixed(2) || "0.00"}</p>
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
