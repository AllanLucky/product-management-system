import React, { useEffect } from 'react'
import '../AdminStyles/OrdersList.css'
import PageTitle from '../components/PageTitle'
import Navbar from '../components/Navbar'
import Footer from '../components/Footer'
import { Link } from 'react-router-dom'
import { Delete, Edit } from '@mui/icons-material'
import { useDispatch, useSelector } from 'react-redux'
import { clearMessage, deleteOrder, fetchAllOrders, removeErrors, removeSuccess } from '../features/admin/adminSlice'
import Loader from '../components/Loader'
import { toast } from 'react-toastify'

function OrdersList() {
    const { orders, loading, error, success, message, deleteLoading } = useSelector(state => state.admin);
    const dispatch = useDispatch();

    useEffect(() => {
        dispatch(fetchAllOrders())
    }, [dispatch])

    useEffect(() => {
        if (error) {
            toast.error(error.message || error, {
                position: "top-right",
                autoClose: 3000
            });
            dispatch(removeErrors());
        }
    }, [dispatch, error]);

    useEffect(() => {
        if (success) {
            toast.success(success.message || "Action successful", {
                position: "top-right",
                autoClose: 3000
            });
            dispatch(removeSuccess());
            dispatch(clearMessage());
            dispatch(fetchAllOrders());
        }
    }, [dispatch, success, message]);

    const handleDelete = async (id) => {
        const confirmDelete = window.confirm(
            "Are you sure you want to delete this order?"
        );
        if (confirmDelete) {
            dispatch(deleteOrder(id))
        }
    };

    if (orders && orders.length === 0) {
        return (
            <div className="no-orders-container">
                <p>No Order Found</p>
            </div>
        )
    }

    return (
        <>
            {loading ? (<Loader />) : (<>
                <PageTitle title="All Orders" />
                <Navbar />
                <div className="ordersList-container">
                    <h1 className="ordersList-title">All Orders</h1>
                    <div className="ordersList-table-container">
                        <table className="ordersList-table">
                            <thead>
                                <tr>
                                    <th></th>
                                    <th>Order ID</th>
                                    <th>Status</th>
                                    <th>Total Price</th>
                                    <th>Number of Items</th>
                                    <th>Actions</th>
                                </tr>
                            </thead>
                            <tbody>
                                {orders && orders.map((order, index) => (
                                    <tr key={order._id}>
                                        <td>{index + 1}</td>
                                        <td>{order._id}</td>
                                        <td className={`order-status ${order.orderStatus.toLowerCase()}`}>{order.orderStatus}</td>
                                        <td>{order.totalPrice.toFixed(2)}</td>
                                        <td>{order.orderItems.length}</td>
                                        <td>
                                            <Link
                                                to={`/admin/order/${order._id}`}
                                                className="action-icon edit-icon"
                                            >
                                                <Edit />
                                            </Link>

                                            <button
                                                className="action-icon delete-icon"
                                                onClick={() => handleDelete(order._id)}
                                                disabled={deleteLoading}
                                            >
                                                {deleteLoading ? (
                                                    <span className="spinner"></span>
                                                ) : (
                                                    <Delete />
                                                )}
                                            </button>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </div>
                <Footer />
            </>)}
        </>
    )
}

export default OrdersList
