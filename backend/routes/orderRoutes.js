import express from 'express';
import { verifyUserAuth, roleBasedAccess } from '../middleware/userAuth.js';
import { createNewOrder, deleteOrder, getAllMyOrders, getAllOrders, getSingleOrder, updateOrderStatus } from '../controllers/orderController.js';
const router = express.Router();

router.post('/new/order', verifyUserAuth, createNewOrder);
router.get('/orders/user', verifyUserAuth, getAllMyOrders);
router.get('/order/:id', verifyUserAuth, getSingleOrder);

// Admin Routes
// router.get('/admin/order/:id', verifyUserAuth, roleBasedAccess('admin'), getSingleOrder);
router.get('/admin/orders', verifyUserAuth, roleBasedAccess('admin'), getAllOrders);
router.put('/admin/order/:id', verifyUserAuth, roleBasedAccess('admin'), updateOrderStatus);
router.delete('/admin/order/:id', verifyUserAuth, roleBasedAccess('admin'), deleteOrder);




export default router