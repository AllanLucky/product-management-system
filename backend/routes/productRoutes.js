import express from 'express';
import {
    createProduct,
    getAllProducts,
    getSingleProduct,
    updateProduct,
    deleteProduct,
    getAdminProducts,
    creatingProductReviews,
    getProductReviews,
    deleteProductReview
} from '../controllers/productController.js';

import { roleBasedAccess, verifyUserAuth } from '../middleware/userAuth.js';

const router = express.Router();

// Public Routes
router.get('/products', getAllProducts);
router.get('/product/:id', getSingleProduct);
router.put('/review', verifyUserAuth, creatingProductReviews);

// Admin Routes
router.get('/admin/products', verifyUserAuth, roleBasedAccess("admin"), getAdminProducts);
router.get('/admin/reviews', verifyUserAuth, roleBasedAccess("admin"), getProductReviews);
router.post('/admin/product/create', verifyUserAuth, roleBasedAccess("admin"), createProduct);
router.put('/admin/product/:id', verifyUserAuth, roleBasedAccess("admin"), updateProduct);
router.delete('/admin/reviews', verifyUserAuth, roleBasedAccess("admin"), deleteProductReview);
router.delete('/admin/product/:id', verifyUserAuth, roleBasedAccess("admin"), deleteProduct);

export default router;

