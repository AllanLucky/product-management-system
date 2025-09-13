import express from 'express';
import {
    createProduct, getAllProducts, getSingleProduct, updateProduct, deleteProduct,
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
router.get('/reviews', getProductReviews);
router.put('/review', verifyUserAuth, creatingProductReviews);
router.delete('/reviews', verifyUserAuth, deleteProductReview);


// Admin Routes
router.get('/admin/products', verifyUserAuth, roleBasedAccess("admin"), getAdminProducts);
router.post('/admin/product/create', verifyUserAuth, roleBasedAccess("admin"), createProduct);
router.put('/admin/product/:id', verifyUserAuth, roleBasedAccess("admin"), updateProduct);
router.delete('/admin/product/:id', verifyUserAuth, roleBasedAccess("admin"), deleteProduct);

export default router;

