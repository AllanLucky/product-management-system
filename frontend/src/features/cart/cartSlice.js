import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";

// ✅ Helper: Get current user key for localStorage
const getUserKey = () => {
    const userInfo = JSON.parse(localStorage.getItem("userInfo"));
    return userInfo?.email || "guest";
};

// ✅ Load cart for current user
const storedCart = JSON.parse(localStorage.getItem(`cartItems_${getUserKey()}`)) || [];
const storedShipping = JSON.parse(localStorage.getItem("shippingInfo")) || {};

export const addItemToCart = createAsyncThunk(
    "cart/addItemToCart",
    async ({ id, quantity }, { rejectWithValue }) => {
        try {
            const { data } = await axios.get(`/api/v1/product/${id}`);
            return {
                id: data.product._id,
                name: data.product.name,
                price: data.product.price,
                image: data.product.images?.[0]?.url || "",
                stock: data.product.stock,
                quantity,
            };
        } catch (error) {
            return rejectWithValue(
                error.response?.data?.message || "Failed to add item to cart. Please try again."
            );
        }
    }
);

export const removeItemFromCart = createAsyncThunk(
    "cart/removeItemFromCart",
    async (id, { rejectWithValue }) => {
        try {
            return id;
        } catch (error) {
            return rejectWithValue(
                error.response?.data?.message || "Failed to remove item"
            );
        }
    }
);

const cartSlice = createSlice({
    name: "cart",
    initialState: {
        cartItems: storedCart,
        loading: false,
        error: null,
        success: false,
        message: null,
        removingId: null,
        shippingInfo: storedShipping,
    },
    reducers: {
        removeErrors: (state) => {
            state.error = null;
        },
        removeMessage: (state) => {
            state.message = null;
        },
        removeItemFromCartLocal: (state) => {
            const userKey = getUserKey();
            state.cartItems = [];
            state.message = "Cart cleared successfully";
            localStorage.setItem(`cartItems_${userKey}`, JSON.stringify([]));
        },
        saveShippingInfo: (state, action) => {
            state.shippingInfo = action.payload;
            localStorage.setItem("shippingInfo", JSON.stringify(state.shippingInfo));
        }
    },
    extraReducers: (builder) => {
        builder
            .addCase(addItemToCart.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(addItemToCart.fulfilled, (state, action) => {
                const Item = action.payload;
                const existingItem = state.cartItems.find((item) => item.id === Item.id);

                if (existingItem) {
                    existingItem.quantity = Math.min(Item.quantity, Item.stock);
                    state.message = "Cart updated successfully";
                } else {
                    state.cartItems.push(Item);
                    state.message = "Item added to cart successfully";
                }

                state.loading = false;
                state.error = null;
                state.success = true;

                const userKey = getUserKey();
                localStorage.setItem(`cartItems_${userKey}`, JSON.stringify(state.cartItems));
            })
            .addCase(addItemToCart.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload || action.error?.message || "An error occurred";
            })

            .addCase(removeItemFromCart.pending, (state) => {
                state.loading = true;
            })
            .addCase(removeItemFromCart.fulfilled, (state, action) => {
                state.cartItems = state.cartItems.filter((item) => item.id !== action.payload);
                state.message = "Item removed from cart successfully";
                state.loading = false;

                const userKey = getUserKey();
                localStorage.setItem(`cartItems_${userKey}`, JSON.stringify(state.cartItems));
            })
            .addCase(removeItemFromCart.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload || action.error?.message || "Failed to remove item";
            });
    },
});

export const {
    removeItemFromCartLocal,
    saveShippingInfo,
    removeErrors,
    removeMessage
} = cartSlice.actions;

export default cartSlice.reducer;
