import Order from '../models/orderModel.js';
import Product from '../models/productModel.js';
import User from '../models/userModel.js';
import HandleError from '../utils/handleError.js';
import handleAsyncError from '../middleware/handleAsyncError.js';

// Create New Order
export const createNewOrder = handleAsyncError(async (req, res, next) => {
    const {
        shippingInfo,
        orderItems,
        paymentInfo,
        itemPrice,
        taxPrice,
        shippingPrice,
        totalPrice
    } = req.body;

    const order = await Order.create({
        shippingInfo,
        orderItems,
        paymentInfo,
        itemPrice,
        taxPrice,
        shippingPrice,
        totalPrice,
        user: req.user._id,
        paidAt: Date.now()
    });

    res.status(201).json({
        success: true,
        order
    });
});

// Get Single Order
export const getSingleOrder = handleAsyncError(async (req, res, next) => {
    const order = await Order.findById(req.params.id).populate("user", "name email");

    if (!order) {
        return next(new HandleError("No order found", 404));
    }

    res.status(200).json({
        success: true,
        order
    });
});

// Get All My Orders
export const getAllMyOrders = handleAsyncError(async (req, res, next) => {
    const orders = await Order.find({ user: req.user._id });

    if (!orders || orders.length === 0) {
        return next(new HandleError("No order found", 404));
    }

    res.status(200).json({
        success: true,
        orders
    });
});

// Get All Orders (Admin)
export const getAllOrders = handleAsyncError(async (req, res, next) => {
    const orders = await Order.find();

    let totalAmount = 0;
    orders.forEach(order => {
        totalAmount += order.totalPrice;
    });

    res.status(200).json({
        success: true,
        orders,
        totalAmount
    });
});

// Update Order Status
export const updateOrderStatus = handleAsyncError(async (req, res, next) => {
    const order = await Order.findById(req.params.id);

    if (!order) {
        return next(new HandleError("No order found", 404));
    }

    if (order.orderStatus === "Delivered") {
        return next(new HandleError("This order has already been delivered", 400));
    }

    // Update stock for each product in the order
    for (let item of order.orderItems) {
        await updateStock(item.product, item.quantity);
    }

    order.orderStatus = req.body.status;

    if (req.body.status === "Delivered") {
        order.deliveredAt = Date.now();
    }

    await order.save({ validateBeforeSave: false });

    res.status(200).json({
        success: true,
        order
    });

    // Helper function to update product stock
    async function updateStock(productId, quantity) {
        const product = await Product.findById(productId);

        if (!product) {
            return next(new HandleError("Product not found", 404));
        }

        // Subtract the quantity ordered from the product stock
        product.stock = product.stock - quantity;

        if (product.stock < 0) {
            product.stock = 0; // prevent negative stock
        }

        await product.save({ validateBeforeSave: false });
    }
});


// Delete Order 

export const deleteOrder = handleAsyncError(async (req, res, next) => {
    const order = await Order.findById(req.params.id);

    if (!order) {
        return next(new HandleError("Order not found", 404));
    }

    if (order.orderStatus !== "Delivered") {
        return next(new HandleError("This order is still processing and cannot be deleted", 400));
    }

    await Order.deleteOne({ _id: req.params.id });

    res.status(200).json({
        success: true,
        message: "Order deleted successfully"
    });
});







