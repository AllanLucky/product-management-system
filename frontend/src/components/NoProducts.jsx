import React from 'react';
import '../componentStyles/NoProducts.css';

function NoProducts({ keyword }) {
  return (
    <div className='no-products-content'>
      <div className="no-products-icon">⚠️</div> {/* Unicode warning icon */}
      <h2 className="no-products-title">No Products Found</h2>
      <p className="no-products-message">
        {keyword
          ? `We couldn't find any products matching  "${keyword}".Try using a keywords or browser our catalog.` :
          'No products are available. Please check back later.'}
      </p>
    </div>
  );
}

export default NoProducts;


