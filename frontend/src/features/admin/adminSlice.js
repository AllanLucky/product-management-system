import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import axios from "axios";

//// FETCHING ALL ADMIN PRODUCTS
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

// CREATING PRODUCTS
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

// UPDATE PRODUCT
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

// DELETE PRODUCT
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

// FETCH ALL USERS...Admin
export const fetchAllUsers = createAsyncThunk(
    'admin/fetchAllUsers',
    async (_, { rejectWithValue }) => {
        try {
            const { data } = await axios.get('/api/v1/admin/users');
            return data;
        } catch (error) {
            const message =
                error.response?.data?.message ||
                error.message ||
                'Error occurred while fetching users';
            return rejectWithValue(message);
        }
    }
);

// FETCH SINGLE USER...Admin
export const fetchSingleUser = createAsyncThunk(
    'admin/fetchSingleUser',
    async (id, { rejectWithValue }) => {
        try {
            const { data } = await axios.get(`/api/v1/admin/user/${id}`);
            return data;
        } catch (error) {
            const message =
                error.response?.data?.message ||
                error.message ||
                'Error occurred while fetching user';
            return rejectWithValue(message);
        }
    }
);

// UPDATE USER ROLE...Admin
export const updateUserRole = createAsyncThunk(
    'admin/updateUserRole',
    async ({ id, role }, { rejectWithValue }) => {
        try {
            const { data } = await axios.put(`/api/v1/admin/user/${id}`, { role }); // send as object
            return data;
        } catch (error) {
            const message =
                error.response?.data?.message ||
                error.message ||
                'Error occurred while updating user role';
            return rejectWithValue(message);
        }
    }
);

// DELETE USER PROFILE...Admin
export const deleteUserProfile = createAsyncThunk(
    'admin/deleteUserProfile',
    async (id, { rejectWithValue }) => {
        try {
            const { data } = await axios.delete(`/api/v1/admin/user/${id}`);
            return data; // { success: true, message: "User deleted successfully" }
        } catch (error) {
            const message =
                error.response?.data?.message ||
                error.message ||
                'Error occurred while deleting the user';
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
        deleteLoading: false,
        users: [],
        user: [],
        message: null
    },
    reducers: {
        removeErrors: (state) => { state.error = null; },
        removeSuccess: (state) => { state.success = false; },
        clearMessage: (state) => { state.message = null; }
    },
    extraReducers: (builder) => {
        builder
            // FETCHING ALL ADMIN PRODUCTS
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

            // CREATING PRODUCT
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

            // UPDATE PRODUCT
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

            // DELETING PRODUCT
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
            })

            // All USERS
            .addCase(fetchAllUsers.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(fetchAllUsers.fulfilled, (state, action) => {
                state.loading = false;
                state.users = action.payload.users;
            })
            .addCase(fetchAllUsers.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload.message || 'Failed to fetch users';
            })

            // GET SINGLE USER
            .addCase(fetchSingleUser.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(fetchSingleUser.fulfilled, (state, action) => {
                state.loading = false;
                state.user = action.payload.user;
            })
            .addCase(fetchSingleUser.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload.message || 'Failed to fetch user';
            })

            // UPDATE USER ROLE
            .addCase(updateUserRole.pending, (state) => {
                state.loading = true;
                state.error = null;
                state.success = null;
            })
            .addCase(updateUserRole.fulfilled, (state, action) => {
                state.loading = false;
                state.success = { message: action.payload.message || 'Role updated successfully' };
                state.error = null;
            })
            .addCase(updateUserRole.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload || 'Failed to update the user role';
                state.success = null;
            })

            // DELETING USERPROFILE
            .addCase(deleteUserProfile.pending, (state) => {
                state.loading = true;
                state.error = null;
                state.success = null;
            })
            .addCase(deleteUserProfile.fulfilled, (state, action) => {
                state.loading = false;
                state.success = { message: action.payload.message || 'User deleted successfully' };
                state.users = state.users.filter(
                    (user) => user._id !== action.meta.arg
                ); // remove deleted user from list
                state.error = null;
            })
            .addCase(deleteUserProfile.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload || 'Failed to delete user';
                state.success = null;
            });
    }
});

export const { removeErrors, removeSuccess, clearMessage } = adminSlice.actions;
export default adminSlice.reducer;
