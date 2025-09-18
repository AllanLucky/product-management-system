import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";

// ✅ Safe localStorage access
const isBrowser = typeof window !== "undefined";

const getUserKey = () => {
    if (isBrowser) {
        try {
            const userInfo = JSON.parse(localStorage.getItem("userInfo"));
            return userInfo?.email || "guest";
        } catch {
            return "guest";
        }
    }
    return "guest";
};

const getStoredCart = () => {
    if (isBrowser) {
        try {
            return JSON.parse(localStorage.getItem(`cartItems_${getUserKey()}`)) || [];
        } catch {
            return [];
        }
    }
    return [];
};

const getStoredShipping = () => {
    if (isBrowser) {
        try {
            return JSON.parse(localStorage.getItem("shippingInfo")) || {};
        } catch {
            return {};
        }
    }
    return {};
};

// ✅ Async Thunks
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
                error.response?.data?.message || "Failed to add item to cart."
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
                error.response?.data?.message || "Failed to remove item."
            );
        }
    }
);

// ✅ Slice
const cartSlice = createSlice({
    name: "cart",
    initialState: {
        cartItems: getStoredCart(),
        shippingInfo: getStoredShipping(),
        loading: false,
        error: null,
        success: false,
        message: null,
        removingId: null,
    },
    reducers: {
        removeErrors: (state) => {
            state.error = null;
        },
        removeMessage: (state) => {
            state.message = null;
        },
        removeItemFromCartLocal: (state) => {
            state.cartItems = [];
            state.message = "Cart cleared successfully";
            if (isBrowser) {
                localStorage.setItem(`cartItems_${getUserKey()}`, JSON.stringify([]));
            }
        },
        saveShippingInfo: (state, action) => {
            state.shippingInfo = action.payload;
            if (isBrowser) {
                localStorage.setItem("shippingInfo", JSON.stringify(state.shippingInfo));
            }
        },
    },
    extraReducers: (builder) => {
        builder
            .addCase(addItemToCart.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(addItemToCart.fulfilled, (state, action) => {
                const newItem = action.payload;
                const existingItem = state.cartItems.find((item) => item.id === newItem.id);

                if (existingItem) {
                    existingItem.quantity = Math.min(newItem.quantity, newItem.stock);
                    state.message = "Cart updated successfully";
                } else {
                    state.cartItems.push(newItem);
                    state.message = "Item added to cart successfully";
                }

                state.loading = false;
                state.success = true;

                if (isBrowser) {
                    localStorage.setItem(`cartItems_${getUserKey()}`, JSON.stringify(state.cartItems));
                }
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

                if (isBrowser) {
                    localStorage.setItem(`cartItems_${getUserKey()}`, JSON.stringify(state.cartItems));
                }
            })
            .addCase(removeItemFromCart.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload || action.error?.message || "Failed to remove item";
            });
    },
});

export const {
    removeErrors,
    removeMessage,
    removeItemFromCartLocal,
    saveShippingInfo,
} = cartSlice.actions;

export default cartSlice.reducer;
