import mongoose from "mongoose";

const productSchema = new mongoose.Schema(
    {
        name: {
            type: String,
            required: [true, "Please enter product name"],
            trim: true,
        },
        description: {
            type: String,
            required: [true, "Please enter product description"],
        },
        price: {
            type: Number,
            required: [true, "Please enter product price"],
            max: [99999999, "Price cannot exceed 8 digits"],
        },
        ratings: {
            type: Number,
            default: 0.0,
        },
        images: [
            {
                public_id: {
                    type: String,
                    required: [true, "Image public_id is required"],
                },
                url: {
                    type: String,
                    required: [true, "Image URL is required"],
                },
            },
        ],
        category: {
            type: String,
            required: [true, "Please enter product category"],
        },
        stock: {
            type: Number,
            required: [true, "Please enter product stock"],
            max: [99999, "Stock cannot exceed 5 digits"],
            default: 1,
        },

        numOfReviews: {
            type: Number,
            default: 0,
        },
        reviews: [
            {
                user: {
                    type: mongoose.Schema.ObjectId,
                    ref: "User",
                    required: true,
                },
                name: {
                    type: String,
                    required: true,
                },
                rating: {
                    type: Number,
                    required: true,
                },
                comment: {
                    type: String,
                    required: true,
                },
                createdAt: {
                    type: Date,
                    default: Date.now,
                },
            },
        ],
        user: {
            type: mongoose.Schema.ObjectId,
            ref: "User",
            required: true,
        },
        createdAt: {
            type: Date,
            default: Date.now,
        },
    },
    {
        timestamps: true,
    }
);

const Product = mongoose.model("Product", productSchema);

export default Product;
