import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import axios from "axios";

// ✅ Async Thunk for Creating Order
export const createOrder = createAsyncThunk(
    "order/createOrder",
    async (orderData, { rejectWithValue }) => {
        try {
            const { data } = await axios.post("/api/orders", orderData); // adjust API URL
            return data; // will go to fulfilled reducer
        } catch (error) {
            return rejectWithValue(
                error.response?.data?.message || error.message || "Failed to create order"
            );
        }
    }
);

// ✅ Async Thunk for Fetching All Orders
export const getOrders = createAsyncThunk(
    "order/getOrders",
    async (_, { rejectWithValue }) => {
        try {
            const { data } = await axios.get("/api/orders");
            return data;
        } catch (error) {
            return rejectWithValue(
                error.response?.data?.message || error.message || "Failed to fetch orders"
            );
        }
    }
);

// ✅ Async Thunk for Fetching Single Order Details
export const getOrderDetails = createAsyncThunk(
    "order/getOrderDetails",
    async (id, { rejectWithValue }) => {
        try {
            const { data } = await axios.get(`/api/orders/${id}`);
            return data;
        } catch (error) {
            return rejectWithValue(
                error.response?.data?.message || error.message || "Failed to fetch order details"
            );
        }
    }
);

const orderSlice = createSlice({
    name: "order",
    initialState: {
        orders: [],
        order: {},
        orderDetails: null,
        loading: false,
        error: null,
        success: false,
    },
    reducers: {
        // 🔹 Utility reducers
        removeErrors: (state) => {
            state.error = null;
        },
        removeSuccess: (state) => {
            state.success = false;
        },
    },
    extraReducers: (builder) => {
        // ✅ Create Order
        builder
            .addCase(createOrder.pending, (state) => {
                state.loading = true;
                state.error = null;
                state.success = false;
            })
            .addCase(createOrder.fulfilled, (state, action) => {
                state.loading = false;
                state.success = true;
                state.order = action.payload;
                state.orderDetails = action.payload;
            })
            .addCase(createOrder.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload;
            });

        // ✅ Get Orders
        builder
            .addCase(getOrders.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(getOrders.fulfilled, (state, action) => {
                state.loading = false;
                state.orders = action.payload;
            })
            .addCase(getOrders.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload;
            });

        // ✅ Get Order Details
        builder
            .addCase(getOrderDetails.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(getOrderDetails.fulfilled, (state, action) => {
                state.loading = false;
                state.orderDetails = action.payload;
            })
            .addCase(getOrderDetails.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload;
            });
    },
});

export const { removeErrors, removeSuccess } = orderSlice.actions;

export default orderSlice.reducer;
