import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import axios from "axios";

// Fetch All Products -- Admin
export const fetchAdminProducts = createAsyncThunk(
    'admin/fetchAdminProducts',
    async (_, { rejectWithValue }) => {
        try {
            const { data } = await axios.get('/api/v1/admin/products');
            return data;
        } catch (error) {
            const message =
                error.response?.data?.message ||
                error.message ||
                'Error occurred while fetching products';
            return rejectWithValue(message);
        }
    }
);

// Create Product
export const createProduct = createAsyncThunk(
    'admin/createProduct',
    async (productData, { rejectWithValue }) => {
        try {
            const config = { headers: { 'Content-Type': 'multipart/form-data' } };
            const { data } = await axios.post('/api/v1/admin/product/create', productData, config);
            return data;
        } catch (error) {
            const message =
                error.response?.data?.message ||
                error.message ||
                'Product creation failed';
            return rejectWithValue(message);
        }
    }
);

// Update Product
export const updateProduct = createAsyncThunk(
    'admin/updateProduct',
    async ({ id, formData }, { rejectWithValue }) => {
        try {
            const config = { headers: { 'Content-Type': 'multipart/form-data' } };
            const { data } = await axios.put(`/api/v1/admin/product/${id}`, formData, config);
            return data;
        } catch (error) {
            const message =
                error.response?.data?.message ||
                error.message ||
                'Product update failed';
            return rejectWithValue(message);
        }
    }
);

// Delete Product
export const deleteProduct = createAsyncThunk(
    'admin/deleteProduct',
    async (id, { rejectWithValue }) => {
        try {
            const { data } = await axios.delete(`/api/v1/admin/product/${id}`);
            return data;
        } catch (error) {
            const message =
                error.response?.data?.message ||
                error.message ||
                'Product deletion failed';
            return rejectWithValue(message);
        }
    }
);

const adminSlice = createSlice({
    name: "admin",
    initialState: {
        products: [],
        product: {},
        success: false,
        loading: false,
        error: null,
        deleteLoading:false
    },
    reducers: {
        removeErrors: (state) => { state.error = null; },
        removeSuccess: (state) => { state.success = false; }
    },
    extraReducers: (builder) => {
        builder
            // Fetch admin products
            .addCase(fetchAdminProducts.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(fetchAdminProducts.fulfilled, (state, action) => {
                state.loading = false;
                state.products = action.payload.products;
            })
            .addCase(fetchAdminProducts.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload || 'Error occurred while fetching products';
            })

            // Create product
            .addCase(createProduct.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(createProduct.fulfilled, (state, action) => {
                state.loading = false;
                state.success = action.payload.success;
                state.products.push(action.payload.product);
            })
            .addCase(createProduct.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload || 'Product creation failed';
            })

            // Update product
            .addCase(updateProduct.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(updateProduct.fulfilled, (state, action) => {
                state.loading = false;
                state.success = action.payload.success;
                state.products = state.products.map((product) =>
                    product._id === action.payload.product._id ? action.payload.product : product
                );
            })
            .addCase(updateProduct.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload || 'Product update failed';
            })

            // Delete product
            .addCase(deleteProduct.pending, (state) => {
                state.deleteLoading = true;
                state.error = null;
            })
            .addCase(deleteProduct.fulfilled, (state, action) => {
                state.deleteLoading = false;
                state.success = action.payload.success;
                state.products = state.products.filter(
                    (product) => product._id !== action.meta.arg
                );
            })
            .addCase(deleteProduct.rejected, (state, action) => {
                state.deleteLoading = false;
                state.error = action.payload || 'Product deletion failed';
            });
    }
});

export const { removeErrors, removeSuccess } = adminSlice.actions;
export default adminSlice.reducer;
