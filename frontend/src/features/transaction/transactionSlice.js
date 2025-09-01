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

            console.log("STK Push Response from backend:", response.data);

            return response.data; // Return full backend response
        } catch (error) {
            console.error("Payment request error:", error.response || error.message);

            const userMessage =
                error.response?.data?.error ||
                "Your M-Pesa transaction could not be processed. Please check your details and try again.";

            return rejectWithValue({ ...error.response?.data, message: userMessage });
        }
    }
);

// ✅ Async thunk to verify transaction (polling)
export const verifyPayment = createAsyncThunk(
    "transaction/verifyPayment",
    async (checkoutRequestId, { rejectWithValue }) => {
        try {
            const response = await axios.get(`/api/v1/transaction/status/${checkoutRequestId}`);

            console.log("Verify payment response from backend:", response.data);

            return response.data; // e.g. { status: "success", ...transaction }
        } catch (error) {
            console.error("Verification error:", error.response || error.message);

            const userMessage =
                error.response?.data?.error ||
                "Failed to verify payment status. Please try again.";

            return rejectWithValue({ ...error.response?.data, message: userMessage });
        }
    }
);

// ✅ Async thunk to handle callback (server → us)
export const handlePaymentCallback = createAsyncThunk(
    "transaction/handlePaymentCallback",
    async (callbackData, { rejectWithValue }) => {
        try {
            const response = await axios.post("/api/v1/transaction/callback", callbackData);

            console.log("M-Pesa Callback Response from backend:", response.data);

            return response.data; // Return backend response
        } catch (error) {
            console.error("Callback error:", error.response || error.message);

            const userMessage =
                error.response?.data?.error ||
                "Failed to process M-Pesa callback. Please try again.";

            return rejectWithValue({ ...error.response?.data, message: userMessage });
        }
    }
);

const transactionSlice = createSlice({
    name: "transaction",
    initialState: {
        status: "idle", // idle | loading | succeeded | failed
        error: null,
        transactionResponse: null,
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
            // === Initiate Payment ===
            .addCase(initiatePayment.pending, (state) => {
                state.status = "loading";
                state.error = null;
            })
            .addCase(initiatePayment.fulfilled, (state, action) => {
                state.status = "succeeded";
                state.transactionResponse = action.payload;

                console.log("Transaction saved in state:", state.transactionResponse);

                if (state.transactionResponse?.message) {
                    state.transactionResponse.message =
                        state.transactionResponse.message ||
                        "M-Pesa transaction initiated successfully. Please check your phone to complete payment.";
                }
            })
            .addCase(initiatePayment.rejected, (state, action) => {
                state.status = "failed";
                state.error =
                    action.payload?.message ||
                    "Your M-Pesa transaction could not be processed. Please try again.";
                console.error("Payment failed:", state.error);
            })

            // === Verify Payment ===
            .addCase(verifyPayment.pending, (state) => {
                state.status = "loading";
            })
            .addCase(verifyPayment.fulfilled, (state, action) => {
                state.status = "succeeded";
                state.transactionResponse = {
                    ...state.transactionResponse,
                    ...action.payload,
                };
                console.log("Verification updated in state:", state.transactionResponse);
            })
            .addCase(verifyPayment.rejected, (state, action) => {
                state.status = "failed";
                state.error =
                    action.payload?.message ||
                    "Failed to verify payment status.";
                console.error("Verification failed:", state.error);
            })

            // === Handle Callback ===
            .addCase(handlePaymentCallback.pending, (state) => {
                state.status = "loading";
            })
            .addCase(handlePaymentCallback.fulfilled, (state, action) => {
                state.status = "succeeded";
                state.transactionResponse = {
                    ...state.transactionResponse,
                    ...action.payload,
                };
                console.log("Callback saved in state:", state.transactionResponse);
            })
            .addCase(handlePaymentCallback.rejected, (state, action) => {
                state.status = "failed";
                state.error =
                    action.payload?.message ||
                    "Failed to process M-Pesa callback.";
                console.error("Callback failed:", state.error);
            });
    },
});

export const { clearTransactionState, removeErrors } = transactionSlice.actions;
export default transactionSlice.reducer;
