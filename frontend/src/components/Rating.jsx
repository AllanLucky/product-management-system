import React, { useState } from 'react';
import '../componentStyles/Rating.css';

// Rating component accepts props through an object (must destructure properly)
function Rating({ value, onRatingChange, disabled }) {
    // Track which star is being hovered over
    const [hoveredRating, setHoveredRating] = useState(0);

    // Track which star is selected by click (default is passed-in value)
    const [selectedRating, setSelectedRating] = useState(value || 0);

    // When mouse hovers a star, highlight it if not disabled
    const handleMouseEnter = (rating) => {
        if (!disabled) {
            setHoveredRating(rating);
        }
    };

    // When mouse leaves the star, reset hover unless disabled
    const handleMouseLeave = () => {
        if (!disabled) {
            setHoveredRating(0);
        }
    };

    // When a star is clicked, update selection and notify parent if handler is provided
    const handleClick = (rating) => {
        if (!disabled) {
            setSelectedRating(rating);
            if (onRatingChange) {
                onRatingChange(rating);
            }
        }
    };

    // Generate 5 stars and render them with interactivity
    const generateStars = () => {
        const stars = [];
        for (let i = 1; i <= 5; i++) {
            const isFilled = i <= (hoveredRating || selectedRating);
            stars.push(
                <span
                    key={i}
                    className={`star ${isFilled ? 'filled' : 'empty'}`}
                    onMouseEnter={() => handleMouseEnter(i)}
                    onMouseLeave={handleMouseLeave}
                    onClick={() => handleClick(i)}
                    style={{ pointerEvents: disabled ? 'none' : 'auto' }}
                >
                    ★
                </span>
            );
        }
        return stars;
    };

    // Component return block rendering the stars
    return (
        <div>
            <div className="rating">
                {generateStars()}
            </div>
        </div>
    );
}

export default Rating;
