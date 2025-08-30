import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";

// ✅ Async thunk to initiate payment
export const initiatePayment = createAsyncThunk(
    "transaction/initiatePayment",
    async ({ phoneNumber, amount, productName, customDesc }, { rejectWithValue }) => {
        try {
            const response = await axios.post("/api/v1/transaction/process", {
                phoneNumber,
                amount,
                productName,
                customDesc,
            });

            // Log the full response for debugging
            console.log("STK Push Response from backend:", response.data);

            return response.data; // Return full backend response
        } catch (error) {
            console.error("Payment request error:", error.response || error.message);
            return rejectWithValue(error.response?.data || error.message);
        }
    }
);

const transactionSlice = createSlice({
    name: "transaction",
    initialState: {
        status: "idle",
        error: null,
        transactionResponse: null, // Store full backend response
    },
    reducers: {
        clearTransactionState: (state) => {
            state.status = "idle";
            state.error = null;
            state.transactionResponse = null;
        },
        removeErrors: (state) => {
            state.error = null;
        },
    },
    extraReducers: (builder) => {
        builder
            .addCase(initiatePayment.pending, (state) => {
                state.status = "loading";
                state.error = null;
            })
            .addCase(initiatePayment.fulfilled, (state, action) => {
                state.status = "succeeded";
                state.transactionResponse = action.payload; // Store full response
                console.log("Transaction saved in state:", state.transactionResponse);
            })
            .addCase(initiatePayment.rejected, (state, action) => {
                state.status = "failed";
                state.error = action.payload?.message || action.payload || "Payment failed";
                console.error("Payment failed:", state.error);
            });
    },
});

export const { clearTransactionState, removeErrors } = transactionSlice.actions;
export default transactionSlice.reducer;
