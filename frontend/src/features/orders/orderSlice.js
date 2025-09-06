import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import axios from "axios";

// ✅ Async Thunk for Creating Order
export const createOrder = createAsyncThunk(
    "order/createOrder",
    async (orderData, { rejectWithValue }) => {
        try {
            const config = {
                headers: { "Content-Type": "application/json" },
            };
            // corrected API endpoint
            const { data } = await axios.post("/api/v1/new/order", orderData, config);
            return data; // return full backend response
        } catch (error) {
            return rejectWithValue(
                error.response?.data?.message ||
                error.message ||
                "Failed to create order"
            );
        }
    }
);

// ✅ Async Thunk for Fetching User's Orders
export const getAllMyOrders = createAsyncThunk(
    "order/getAllMyOrders",
    async (_, { rejectWithValue }) => {
        try {
            // corrected API endpoint
            const { data } = await axios.get("/api/v1/orders/user");
            return data; // return full backend response
        } catch (error) {
            return rejectWithValue(
                error.response?.data?.message ||
                error.message ||
                "Failed to fetch your orders"
            );
        }
    }
);

// ✅ Async Thunk for Fetching Single Order Details
export const getOrderDetails = createAsyncThunk(
    "order/getOrderDetails",
    async (id, { rejectWithValue }) => {
        try {
            // corrected API endpoint
            const { data } = await axios.get(`/api/v1/admin/order/${id}`);
            return data; // return full backend response
        } catch (error) {
            return rejectWithValue(
                error.response?.data?.message ||
                error.message ||
                "Failed to fetch order details"
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
                state.order = action.payload.order; // extract order from backend response
                state.success = action.payload.success; // extract success flag
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
                state.orders = action.payload.orders; // extract orders array
                state.success = action.payload.success; // extract success flag
            })
            .addCase(getAllMyOrders.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload?.message || "Failed to fetch your orders";

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
                state.error = action.payload;
            });
    },
});

export const { removeErrors, removeSuccess } = orderSlice.actions;

export default orderSlice.reducer;
