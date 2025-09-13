import React, { useEffect } from "react";
import Navbar from "../components/Navbar";
import PageTitle from "../components/PageTitle";
import "../AdminStyles/ProductsList.css";
import Footer from "../components/Footer";
import { Link } from "react-router-dom";
import { Delete, Edit } from "@mui/icons-material";
import { useDispatch, useSelector } from "react-redux";
import { fetchAdminProducts, removeErrors } from "../features/admin/adminSlice";
import { toast } from "react-toastify";

function ProductList() {
    const { products, loading, error } = useSelector((state) => state.admin);
    const dispatch = useDispatch();

    useEffect(() => {
        dispatch(fetchAdminProducts());
    }, [dispatch]);

    useEffect(() => {
        if (error) {
            toast.error(error, {
                position: "top-right",
                autoClose: 3000,
            });
            dispatch(removeErrors()); // Clear error after reporting
        }
    }, [error, dispatch]);

    if (!products || products.length === 0) {
        return (
            <div className="product-list-container">
                <h1 className="product-list-title">Admin Products</h1>
                <p className="no-admin-products">No Product Found</p>
            </div>
        );
    }

    return (
        <>
            <PageTitle title="All products" />
            <Navbar />
            <div className="product-list-container">
                <h1 className="product-list-title">All Products</h1>

                {/* Show loading state */}
                {loading && <p>Loading products...</p>}

                {/* Render table only if not loading */}
                {!loading && (
                    <table className="product-table">
                        <thead>
                            <tr>
                                <th>Serial No</th>
                                <th>Product Image</th>
                                <th>Product Name</th>
                                <th>Price</th>
                                <th>Rating</th>
                                <th>Category</th>
                                <th>Stock</th>
                                <th>Created At</th>
                                <th>Actions</th>
                            </tr>
                        </thead>
                        <tbody>
                            {products.length > 0 ? (
                                products.map((product, index) => (
                                    <tr key={product._id || index}>
                                        <td>{index + 1}</td>
                                        <td>
                                            <img
                                                src={product.images?.[0]?.url || "/placeholder.png"}
                                                alt={product.name}
                                                className="admin-product-image"
                                            />
                                        </td>
                                        <td>{product.name}</td>
                                        <td>{product.price}</td>
                                        <td>{product.ratings}</td>
                                        <td>{product.category}</td>
                                        <td>{product.stock}</td>
                                        <td>
                                            {new Date(product.createdAt).toLocaleDateString()}
                                        </td>
                                        <td>
                                            <Link
                                                to={`/admin/product/${product._id}`}
                                                className="action-icon edit-icon"
                                            >
                                                <Edit />
                                            </Link>
                                            <Link
                                                to={`/admin/product/${product._id}`}
                                                className="action-icon delete-icon"
                                            >
                                                <Delete />
                                            </Link>
                                        </td>
                                    </tr>
                                ))
                            ) : (
                                <tr>
                                    <td colSpan="9" style={{ textAlign: "center" }}>
                                        No products found.
                                    </td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                )}
            </div>
            <Footer />
        </>
    );
}

export default ProductList;
