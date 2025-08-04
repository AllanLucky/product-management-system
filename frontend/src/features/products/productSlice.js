import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';

// ✅ Get All Product
export const getProduct = createAsyncThunk(
    'product/getProduct',
    async ({ keyword }, { rejectWithValue }) => {
        try {
            const link = keyword
                ? `/api/v1/products?keyword=${encodeURIComponent(keyword)}`
                : '/api/v1/products';

            const { data } = await axios.get(link);
            console.log('response', data); // Should include products, productCount etc.
            return data; // ✅ return entire data object
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
            const link = `/api/v1/product/${id}`;
            const { data } = await axios.get(link);
            console.log('Product Detail response', data);
            return data;
        } catch (error) {
            return rejectWithValue(error.response?.data || 'An error occurred');
        }
    }
);

export const productSlice = createSlice({
    name: 'product',
    initialState: {
        products: [],
        productCount: 0,
        loading: false,
        error: null,
        product: null,
        stock: null,
        reviews: [],
    },
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
                state.error = null;
            })
            .addCase(getProduct.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload || 'Something went wrong';
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
