import React, { useEffect, useState } from 'react';
import PageTitle from '../components/PageTitle';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import '../AdminStyles/ReviewsList.css';
import { Delete } from '@mui/icons-material';
import { useDispatch, useSelector } from 'react-redux';
import {
    fetchAdminProducts,
    fetchAllProductReviews,
    deleteProductReview,
    removeErrors
} from '../features/admin/adminSlice';
import { toast } from 'react-toastify';
import Loader from '../components/Loader';

function ReviewsList() {
    const { products, loading, reviews, error, deleteLoading } = useSelector(state => state.admin);
    const [selectedProduct, setSelectedProduct] = useState(null);
    const dispatch = useDispatch();

    useEffect(() => {
        dispatch(fetchAdminProducts());
    }, [dispatch]);

    useEffect(() => {
        if (error) {
            toast.error(error, { position: 'top-right', autoClose: 3000 });
            dispatch(removeErrors());
        }
    }, [dispatch, error]);

    const handleViewReviews = (id) => {
        setSelectedProduct(id);
        dispatch(fetchAllProductReviews(id));
    };

    const handleDeleteReview = (reviewId) => {
        dispatch(deleteProductReview({ productId: selectedProduct, reviewId }))
            .then(() => {
                toast.success("Review deleted successfully", { position: 'top-right', autoClose: 3000 });
                dispatch(fetchAllProductReviews(selectedProduct)); // Refresh reviews
            })
            .catch(() => {
                toast.error("Failed to delete review", { position: 'top-right', autoClose: 3000 });
            });
    };

    if (loading) return <Loader />;

    return (
        <>
            <Navbar />
            <PageTitle title="All Reviews" />
            <div className="reviews-list-container">
                <h1 className="reviews-list-title">All Products</h1>

                {products.length === 0 ? (
                    <p>No Products Found</p>
                ) : (
                    <table className="reviews-table">
                        <thead>
                            <tr>
                                <th>SI No</th>
                                <th>Product Name</th>
                                <th>Product Image</th>
                                <th>Number of Reviews</th>
                                <th>Actions</th>
                            </tr>
                        </thead>
                        <tbody>
                            {products.map((product, index) => (
                                <tr key={product._id}>
                                    <td>{index + 1}</td>
                                    <td>{product.name}</td>
                                    <td>
                                        <img
                                            src={product.images?.[0]?.url || '/placeholder.png'}
                                            alt={`Image of ${product.name}`}
                                            className="product-image"
                                        />
                                    </td>
                                    <td>{product.numOfReviews || 0}</td>
                                    <td>
                                        {product.numOfReviews > 0 && (
                                            <button
                                                className="action-btn view-btn"
                                                onClick={() => handleViewReviews(product._id)}
                                            >
                                                View Reviews
                                            </button>
                                        )}
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                )}

                {selectedProduct && (
                    <div className="reviews-details">
                        <h2>
                            Reviews for:{" "}
                            {products.find(p => p._id === selectedProduct)?.name || "Selected Product"}
                        </h2>

                        {deleteLoading && <Loader />}
                        <table className="reviews-table">
                            <thead>
                                <tr>
                                    <th>SI No</th>
                                    <th>User</th>
                                    <th>Rating</th>
                                    <th>Comment</th>
                                    <th>Actions</th>
                                </tr>
                            </thead>
                            <tbody>
                                {reviews.length > 0 ? (
                                    reviews.map((review, index) => (
                                        <tr key={review._id}>
                                            <td>{index + 1}</td>
                                            <td>{review.name}</td>
                                            <td>{review.rating}</td>
                                            <td>{review.comment}</td>
                                            <td>
                                                <button
                                                    className="action-btn delete-btn"
                                                    onClick={() => handleDeleteReview(review._id)}
                                                    title="Delete Review"
                                                >
                                                    <Delete />
                                                </button>
                                            </td>
                                        </tr>
                                    ))
                                ) : (
                                    <tr>
                                        <td colSpan="5">No Reviews Found</td>
                                    </tr>
                                )}
                            </tbody>
                        </table>
                    </div>
                )}
            </div>
            <Footer />
        </>
    );
}

export default ReviewsList;
