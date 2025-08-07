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
            return rejectWithValue(error.response?.data || 'An error occurred');
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
            return rejectWithValue(error.response?.data || 'An error occurred');
        }
    }
);

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
};

export const productSlice = createSlice({
    name: 'product',
    initialState,
    reducers: {
        removeErrors: (state) => {
            state.error = null;
        },
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
                state.error = null;
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
                state.error = null;
            })
            .addCase(getProductDetails.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload || 'Something went wrong';
            });
    },
});

export const { removeErrors } = productSlice.actions;
export default productSlice.reducer;
