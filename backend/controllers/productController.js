import Product from "../models/productModel.js";
import HandleError from "../utils/handleError.js";
import handleAsyncError from "../middleware/handleAsyncError.js";
import APIFunctionality from "../utils/apiFunctionality.js";
import { v2 as cloudinary } from 'cloudinary';

// ✅ Create a new product
export const createProduct = handleAsyncError(async (req, res, next) => {
    let images = [];

    if (typeof req.body.images === "string") {
        images.push(req.body.images);
    } else if (Array.isArray(req.body.images)) {
        images = req.body.images;
    }

    const imagesLink = [];

    for (let i = 0; i < images.length; i++) {
        const result = await cloudinary.uploader.upload(images[i], {
            folder: "products"
        });

        imagesLink.push({
            public_id: result.public_id,
            url: result.secure_url,
        });
    }

    req.body.images = imagesLink;
    req.body.user = req.user._id;

    const product = await Product.create(req.body);

    res.status(201).json({
        success: true,
        message: "Product created successfully",
        product,
    });
});

// ✅ Get all products (search, filter, pagination)
export const getAllProducts = handleAsyncError(async (req, res, next) => {
    const resultPerPage = 6;

    const apiFeatures = new APIFunctionality(Product.find(), req.query)
        .search()
        .filter();

    const filteredQuery = apiFeatures.query.clone();
    const productCount = await filteredQuery.countDocuments();

    apiFeatures.pagination(resultPerPage);
    const products = await apiFeatures.query;

    const totalPages = Math.ceil(productCount / resultPerPage);
    const page = Number(req.query.page) || 1;

    if (page > totalPages && productCount > 0) {
        return next(new HandleError("This page does not exist", 404));
    }

    if (!products || products.length === 0) {
        return next(new HandleError("No products found", 404));
    }

    res.status(200).json({
        success: true,
        products,
        resultPerPage,
        currentPage: page,
        productCount,
        totalPages,
    });
});

// ✅ Get a single product by ID
export const getSingleProduct = handleAsyncError(async (req, res, next) => {
    const product = await Product.findById(req.params.id);

    if (!product) {
        return next(new HandleError("Product not found", 404));
    }

    res.status(200).json({
        success: true,
        product,
    });
});

// ✅ Create or update a review
export const creatingProductReviews = handleAsyncError(async (req, res, next) => {
    const { rating, comment, productId } = req.body;

    const review = {
        user: req.user._id,
        name: req.user.name,
        rating: Number(rating),
        comment,
    };

    const product = await Product.findById(productId);

    if (!product) {
        return next(new HandleError("Product not found", 400));
    }

    const existingReview = product.reviews.find(
        r => r.user.toString() === req.user._id.toString()
    );

    if (existingReview) {
        existingReview.rating = rating;
        existingReview.comment = comment;
    } else {
        product.reviews.push(review);
    }

    product.numOfReviews = product.reviews.length;

    const totalRating = product.reviews.reduce((sum, r) => sum + r.rating, 0);
    product.ratings = product.reviews.length > 0 ? totalRating / product.reviews.length : 0;

    await product.save({ validateBeforeSave: false });

    res.status(200).json({
        success: true,
        product,
    });
});

// ✅ Get all reviews for a product
export const getProductReviews = handleAsyncError(async (req, res, next) => {
    const product = await Product.findById(req.query.id);

    if (!product) {
        return next(new HandleError("Product not found", 400));
    }

    res.status(200).json({
        success: true,
        reviews: product.reviews,
    });
});

// ✅ Delete a review
export const deleteProductReview = handleAsyncError(async (req, res, next) => {
    const product = await Product.findById(req.query.productId);

    if (!product) {
        return next(new HandleError("Product not found", 400));
    }

    const reviews = product.reviews.filter(
        r => r._id.toString() !== req.query.id.toString()
    );

    const totalRating = reviews.reduce((sum, r) => sum + r.rating, 0);
    const ratings = reviews.length > 0 ? totalRating / reviews.length : 0;

    await Product.findByIdAndUpdate(
        req.query.productId,
        {
            reviews,
            ratings,
            numOfReviews: reviews.length,
        },
        {
            new: true,
            runValidators: true,
        }
    );

    res.status(200).json({
        success: true,
        message: "Review deleted successfully",
    });
});

// ✅ Update a product
export const updateProduct = handleAsyncError(async (req, res, next) => {
    const product = await Product.findByIdAndUpdate(
        req.params.id,
        req.body,
        { new: true, runValidators: true }
    );

    if (!product) {
        return next(new HandleError("Product not found", 404));
    }

    res.status(200).json({
        success: true,
        message: "Product updated successfully",
        product,
    });
});

// ✅ Delete a product
export const deleteProduct = handleAsyncError(async (req, res, next) => {
    const product = await Product.findByIdAndDelete(req.params.id);

    if (!product) {
        return next(new HandleError("Product not found", 404));
    }

    res.status(200).json({
        success: true,
        message: "Product deleted successfully",
    });
});

// ✅ Admin: Get all products
export const getAdminProducts = handleAsyncError(async (req, res, next) => {
    const products = await Product.find();

    res.status(200).json({
        success: true,
        products,
    });
});
