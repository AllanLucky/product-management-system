import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import '../componentStyles/Product.css';
import Rating from './Rating';

function Product({ product }) {
    const [rating, setRating] = useState(product.ratings || 0);

    const handleRatingChange = (newRating) => {
        setRating(newRating);
        console.log(`Rating changed to: ${newRating}`);
    };

    const productImage = product.images?.[0]?.url || "/images/hp-laptop.webp";
    const reviewLabel = product.numOfReviews === 1 ? "Review" : "Reviews";

    // Limit description preview (first 100 chars)
    const truncateDescription = (desc, limit = 100) => {
        if (!desc) return "";
        return desc.length > limit ? desc.substring(0, limit) + "..." : desc;
    };

    return (
        <Link to={`/product/${product._id}`} className="product_id">
            <div className="product-card">
                <img
                    src={productImage}
                    alt={product.name}
                    className="product-image"
                />
                <div className="product-details">
                    <h3 className="product-title">{product.name}</h3>
                    <p className="product-description">
                        {truncateDescription(product.description, 100)}
                    </p>
                    <p className="home-price">
                        <strong>Price:</strong> KES {Number(product.price).toLocaleString()}
                    </p>
                    <div className="rating_container">
                        <Rating
                            value={rating}
                            onRatingChange={handleRatingChange}
                            disabled={true}
                        />
                    </div>
                    <span className='productCardSpan'>
                        ({product.numOfReviews} {reviewLabel})
                    </span>
                    <button className="add-to-cart">View Details</button>
                </div>
            </div>
        </Link>
    );
}

export default Product;
