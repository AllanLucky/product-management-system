import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import axios from "axios";

// ✅ Async Thunk for Creating Order
export const createOrder = createAsyncThunk(
    "order/createOrder",
    async (orderData, { rejectWithValue }) => {
        try {
            const config = { headers: { "Content-Type": "application/json" } };
            const { data } = await axios.post("/api/v1/new/order", orderData, config);
            return data;
        } catch (error) {
            return rejectWithValue(
                error.response?.data?.message || error.message || "Failed to create order"
            );
        }
    }
);

// ✅Fetching User's Orders
export const getAllMyOrders = createAsyncThunk(
    "order/getAllMyOrders",
    async (_, { rejectWithValue }) => {
        try {
            const { data } = await axios.get("/api/v1/orders/user");
            return data;
        } catch (error) {
            return rejectWithValue(
                error.response?.data?.message || error.message || "Failed to fetch your orders"
            );
        }
    }
);

// ✅ Single Order Details
export const getOrderDetails = createAsyncThunk(
    "order/getOrderDetails",
    async (id, { rejectWithValue }) => {
        try {
            const { data } = await axios.get(`/api/v1/order/${id}`);
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
        removeErrors: (state) => { state.error = null; },
        removeSuccess: (state) => { state.success = false; },
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
                state.order = action.payload.order;
                state.success = action.payload.success;
            })
            .addCase(createOrder.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload;
            });

        // ✅ Get My Orders
        builder
            .addCase(getAllMyOrders.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(getAllMyOrders.fulfilled, (state, action) => {
                state.loading = false;
                state.orders = action.payload.orders;
                state.success = action.payload.success;
            })
            .addCase(getAllMyOrders.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload || "Failed to fetch your orders";
            });

        // ✅ Get Order Details
        builder
            .addCase(getOrderDetails.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(getOrderDetails.fulfilled, (state, action) => {
                state.loading = false;
                state.orderDetails = action.payload.order;
            })
            .addCase(getOrderDetails.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload || "Failed to fetch order details";
            });
    },
});

export const { removeErrors, removeSuccess } = orderSlice.actions;
export default orderSlice.reducer;
