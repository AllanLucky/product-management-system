import React from 'react'
import Navbar from '../components/Navbar';
import PageTitle from '../components/PageTitle';
import Footer from '../components/Footer';

function OrderFound({ keyword }) {
    return (

        <>
            <Navbar />
            <PageTitle title="NO Order Found" />
            <div className='no-products-content'>
                <div className="no-products-icon">⚠️</div> {/* Unicode warning icon */}
                <h2 className="no-products-title">No Orders Found</h2>
                <p className="no-products-message">
                    {keyword
                        ? `We couldn't find any orders matching "${keyword}". Try using different keywords or filters.`
                        : 'No orders are available at the moment. Please check back later.'}
                </p>
            </div>
            <Footer />

        </>
    );
}

export default OrderFound
