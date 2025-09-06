import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';

// ✅ Get All Products
export const getProduct = createAsyncThunk(
    'product/getProduct',
    async ({ keyword, page = 1, category }, { rejectWithValue }) => {
        try {
            let link = `/api/v1/products?page=${page}`;
            if (category) {
                link += `&category=${encodeURIComponent(category)}`;
            }
            if (keyword) {
                link += `&keyword=${encodeURIComponent(keyword)}`;
            }

            const { data } = await axios.get(link);
            console.log('Product list response:', data);
            return data;
        } catch (error) {
            return rejectWithValue(error.response?.data?.message || 'An error occurred');
        }
    }
);

// ✅ Get Product Details
export const getProductDetails = createAsyncThunk(
    'product/getProductDetails',
    async (id, { rejectWithValue }) => {
        try {
            const { data } = await axios.get(`/api/v1/product/${id}`);
            console.log('Product detail response:', data);
            return data;
        } catch (error) {
            return rejectWithValue(error.response?.data?.message || 'An error occurred');
        }
    }
);

// ✅ Create Customer Review
export const createReview = createAsyncThunk(
    'product/createReview',
    async ({ rating, comment, productId }, { rejectWithValue }) => {
        try {
            const config = { headers: { "Content-Type": "application/json" } };
            const { data } = await axios.put(
                `/api/v1/review`,
                { rating, comment, productId },
                config
            );
            console.log('Review response:', data);
            return data;
        } catch (error) {
            return rejectWithValue(error.response?.data?.message || 'An error occurred');
        }
    }
);

// ✅ Initial State
const initialState = {
    products: [],
    productCount: 0,
    resultPerPage: 0,
    currentPage: 1,
    totalPages: 0,
    loading: false,
    error: null,
    product: null,
    stock: null,
    reviews: [],
    reviewSuccess: false,
    reviewLoading: false,
};

// ✅ Slice
export const productSlice = createSlice({
    name: 'product',
    initialState,
    reducers: {
        removeErrors: (state) => {
            state.error = null;
        },
        removeSuccess: (state) => {
            state.reviewSuccess = false;
            state.reviewLoading = false;
        }
    },
    extraReducers: (builder) => {
        builder
            // ✅ Get All Products
            .addCase(getProduct.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(getProduct.fulfilled, (state, action) => {
                state.loading = false;
                state.products = action.payload.products;
                state.productCount = action.payload.productCount;
                state.resultPerPage = action.payload.resultPerPage;
                state.currentPage = action.payload.currentPage;
                state.totalPages = action.payload.totalPages;
            })
            .addCase(getProduct.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload || 'Something went wrong';
                state.products = [];
            })

            // ✅ Get Product Details
            .addCase(getProductDetails.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(getProductDetails.fulfilled, (state, action) => {
                state.loading = false;
                state.product = action.payload.product;
                state.stock = action.payload.product?.stock || 0;
                state.reviews = action.payload.product?.reviews || [];
            })
            .addCase(getProductDetails.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload || 'Something went wrong';
            })

            // ✅ Create Review
            .addCase(createReview.pending, (state) => {
                state.reviewLoading = true;
                state.reviewSuccess = false;
                state.error = null;
            })
            .addCase(createReview.fulfilled, (state, action) => {
                state.reviewLoading = false;
                state.reviewSuccess = action.payload.success || true;

                // ✅ Update reviews in state if API returns new review
                if (action.payload.review) {
                    state.reviews = [action.payload.review, ...state.reviews];
                }
            })
            .addCase(createReview.rejected, (state, action) => {
                state.reviewLoading = false;
                state.reviewSuccess = false;
                state.error = action.payload || 'Failed to submit review';
            });
    },
});

// ✅ Export
export const { removeErrors, removeSuccess } = productSlice.actions;
export default productSlice.reducer;
