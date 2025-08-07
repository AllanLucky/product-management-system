import Product from "../models/productModel.js";
import HandleError from "../utils/handleError.js";
import handleAsyncError from "../middleware/handleAsyncError.js";
import APIFunctionality from "../utils/apiFunctionality.js";

// ✅ Create a new product
export const createProduct = handleAsyncError(async (req, res, next) => {
    // Attach the logged-in user's ID to the product (vendor/admin)
    req.body.user = req.user._id;

    const product = await Product.create(req.body);

    res.status(201).json({
        success: true,
        message: "Product created successfully",
        product,
    });
});

// ✅ Get all products (with search, filter, pagination)
export const getAllProducts = handleAsyncError(async (req, res, next) => {
    const resultPerPage = 3; // Number of products per page

    const apiFeatures = new APIFunctionality(Product.find(), req.query)
        .search()
        .filter();

    // Clone query before pagination to count results
    const filteredQuery = apiFeatures.query.clone();
    const productCount = await filteredQuery.countDocuments();

    // Pagination
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


// ✅ Creating and Updating reviews
export const creatingProductReviews = handleAsyncError(async (req, res, next) => {
    const { rating, comment, productId } = req.body;

    const review = {
        user: req.user._id,
        name: req.user.name,
        rating: Number(rating),
        comment,
    };

    const product = await Product.findById(productId); // ⬅️ Moved above the check

    if (!product) {
        return next(new HandleError("Product not found", 400));
    }

    const reviewExists = product.reviews.find(
        review => review.user.toString() === req.user.id
    );

    if (reviewExists) {
        product.reviews.forEach(review => {
            if (review.user.toString() === req.user.id.toString()) {
                review.rating = rating;
                review.comment = comment;
            }
        });
    } else {
        product.reviews.push(review);
    }

    product.numOfReviews = product.reviews.length;

    let sum = 0;
    product.reviews.forEach(review => {
        sum += review.rating;
    });

    product.ratings = product.reviews.length > 0 ? sum / product.reviews.length : 0;
    await product.save({ validateBeforeSave: false });

    res.status(200).json({
        success: true,
        product
    });
});

//✅ Getting Reviews
export const getProductReviews = handleAsyncError(async (req, res, next) => {

    const product = await Product.findById(req.query.id);
    if (!product) {
        return next(new HandleError("Product not found", 400));
    }
    res.status(200).json({
        success: true,
        reviews: product.reviews
    });

})

//✅ Deleting Product Reviews
export const deleteProductReview = handleAsyncError(async (req, res, next) => {

    const product = await Product.findById(req.query.productId);
    if (!product) {
        return next(new HandleError("Product not found", 400));
    }

    const reviews = product.reviews.filter(review => review._id.toString() !== req.query.id.toString());

    let sum = 0;

    reviews.forEach(review => {
        sum += review.rating; // should be `rating`, not `ratings`
    });

    const ratings = reviews.length > 0 ? sum / reviews.length : 0;
    const numOfReviews = reviews.length;

    await Product.findByIdAndUpdate(
        req.query.productId,
        {
            reviews,
            ratings,
            numOfReviews
        },
        {
            new: true,
            runValidators: true
        }
    );

    res.status(200).json({
        success: true,
        message: "Review Deleted Successfully"
    });

});



// ✅ Update a product by ID
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

// ✅ Delete a product by ID
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

// Admin Getting All Products

export const getAdminProducts = handleAsyncError(async (req, res, next) => {
    const products = await Product.find();
    res.status(200).json({
        success: true,
        products
    })
})
