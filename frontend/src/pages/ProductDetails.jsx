import React, { useEffect, useState } from 'react';
import '../pageStyles/ProductDetails.css';
import PageTitle from '../components/PageTitle';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import Rating from '../components/Rating';
import Loader from '../components/Loader';
import { useDispatch, useSelector } from 'react-redux';
import { useParams } from 'react-router-dom';
import { getProductDetails, removeErrors } from '../features/products/productSlice';
import { addItemToCart, removeMessage } from '../features/cart/cartSlice';
import { toast } from 'react-toastify';

function ProductDetails() {
    const [userRating, setUserRating] = useState(0);
    const [quantity, setQuantity] = useState(1);

    const dispatch = useDispatch();
    const { id } = useParams();

    const { loading, error, product } = useSelector(state => state.product);
    const { loading: cartLoading, message } = useSelector(state => state.cart);

    // Fetch product details
    useEffect(() => {
        if (id) dispatch(getProductDetails(id));
        return () => dispatch(removeErrors());
    }, [dispatch, id]);

    // Show errors
    useEffect(() => {
        if (error) {
            toast.error(typeof error === 'string' ? error : error.message || 'An error occurred', {
                position: 'top-right',
                autoClose: 3000,
            });
            dispatch(removeErrors());
        }
    }, [error, dispatch]);

    // Show cart messages (added/updated) and clear
    useEffect(() => {
        if (message) {
            toast.success(message, { position: 'top-right', autoClose: 3000 });
            dispatch(removeMessage());
        }
    }, [message, dispatch]);

    const productName = product?.name || product?.title || 'Product Name';
    const productDescription = product?.description || 'Product Description';
    const productPrice = product?.price?.toLocaleString() || '0';
    const productStock = typeof product?.stock === 'number' ? product.stock : 0;
    const productImage = product?.images?.[0]?.url || "/images/hp-laptop.webp";

    // Quantity Handlers
    const increaseQuantity = () => {
        if (quantity < productStock) setQuantity(quantity + 1);
        else toast.error("Cannot exceed available stock!", { position: "top-right", autoClose: 3000 });
    };

    const decreaseQuantity = () => {
        if (quantity > 1) setQuantity(quantity - 1);
        else toast.error("Quantity cannot be less than 1!", { position: "top-right", autoClose: 3000 });
    };

    // Add to cart
    const handleAddToCart = () => {
        dispatch(addItemToCart({ id: product._id, quantity }));
    };

    return (
        <>
            {loading ? (
                <Loader />
            ) : (
                <>
                    <PageTitle title={`${productName}-Details`} />
                    <Navbar />

                    <div className="product-details-container">
                        <div className="product-detail-container">
                            <div className="product-image-container">
                                <img src={productImage} alt={productName} className='product-detail-image' />
                            </div>

                            <div className="product-info">
                                <h2>{productName}</h2>
                                <p className="product-description">{productDescription}</p>
                                <p className="product-price">Price: KES {productPrice}</p>

                                <div className="product-rating">
                                    <Rating value={product?.ratings} disabled={true} />
                                    <span className="productCardSpan">
                                        ({product?.numOfReviews} {product?.numOfReviews === 1 ? 'Review' : 'Reviews'})
                                    </span>
                                </div>

                                <div className="stock-status">
                                    <div className={productStock > 0 ? 'in-stock' : 'out-of-stock'}>
                                        {productStock > 0 ? `In Stock (${productStock} available)` : 'Out of Stock'}
                                    </div>

                                    {productStock > 0 && (
                                        <>
                                            <div className="quantity-control">
                                                <span className="quantity-label">Quantity:</span>
                                                <button className="quantity-button" onClick={decreaseQuantity}>-</button>
                                                <input type="text" value={quantity} className='quantity-value' readOnly />
                                                <button className="quantity-button" onClick={increaseQuantity}>+</button>
                                            </div>

                                            <button
                                                className="add-to-cart-btn"
                                                onClick={handleAddToCart}
                                                disabled={cartLoading}
                                            >
                                                {cartLoading ? 'Adding...' : 'Add to Cart'}
                                            </button>
                                        </>
                                    )}

                                    <form className='review-form'>
                                        <h3>Write a Review</h3>
                                        <Rating
                                            value={userRating}
                                            disabled={false}
                                            onRatingChange={setUserRating}
                                        />
                                        <textarea className='review-input' placeholder='Write your review here..'></textarea>
                                        <button className="submit-review-btn">Submit Review</button>
                                    </form>
                                </div>
                            </div>
                        </div>
                    </div>

                    <div className="reviews-container">
                        <h3>Customer Reviews</h3>
                        <div className="reviews-section">
                            {Array.isArray(product?.reviews) && product.reviews.length > 0 ? (
                                product.reviews.map((review, index) => (
                                    <div className="review-item" key={index}>
                                        <div className="review-header">
                                            <Rating value={review.rating} disabled={true} />
                                        </div>
                                        <p className="review-comment">{review.comment}</p>
                                        <p className="review-name">By {review.name}</p>
                                    </div>
                                ))
                            ) : (
                                <p>No reviews yet.</p>
                            )}
                        </div>
                    </div>

                    <Footer />
                </>
            )}
        </>
    );
}

export default ProductDetails;
