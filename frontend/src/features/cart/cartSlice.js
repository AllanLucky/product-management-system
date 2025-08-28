import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";

// ✅ Thunk: Fetch product by ID and add with quantity
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
                quantity, // exact quantity from UI
            };
        } catch (error) {
            return rejectWithValue(
                error.response?.data?.message ||
                "Failed to add item to cart. Please try again."
            );
        }
    }
);

// ✅ Thunk: Remove item (async for loading state)
export const removeItemFromCart = createAsyncThunk(
    "cart/removeItemFromCart",
    async (id, { rejectWithValue }) => {
        try {
            // if you need backend call
            // await axios.delete(`/api/v1/cart/${id}`);
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
        cartItems: JSON.parse(localStorage.getItem("cartItems")) || [],
        loading: false,
        error: null,
        success: false,
        message: null,
        removingId: null,
        shippingInfo:JSON.parse(localStorage.getItem("shippingInfo")) || {}
    },
    reducers: {
        removeErrors: (state) => {
            state.error = null;
        },
        removeMessage: (state) => {
            state.message = null;
        },
        removeItemFromCartLocal: (state) => {   // ✅ renamed for clarity (local clear)
            state.cartItems = [];
            state.message = "Cart cleared successfully";
            localStorage.setItem("cartItems", JSON.stringify(state.cartItems));
        },
        saveShippingInfo: (state, action) => {
            state.shippingInfo = action.payload;
            localStorage.setItem("shippingInfo", JSON.stringify(state.shippingInfo));
        }
    },
    extraReducers: (builder) => {
        builder
            // ✅ add item
            .addCase(addItemToCart.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(addItemToCart.fulfilled, (state, action) => {
                const Item = action.payload;
                const existingItem = state.cartItems.find(
                    (item) => item.id === Item.id
                );

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
                localStorage.setItem("cartItems", JSON.stringify(state.cartItems));
            })
            .addCase(addItemToCart.rejected, (state, action) => {
                state.loading = false;
                state.error =
                    action.payload ||
                    action.error?.message ||
                    "An error occurred";
            })

            // ✅ remove item
            .addCase(removeItemFromCart.pending, (state) => {
                state.loading = true;
            })
            .addCase(removeItemFromCart.fulfilled, (state, action) => {
                state.cartItems = state.cartItems.filter(
                    (item) => item.id !== action.payload
                );
                state.message = "Item removed from cart successfully";
                state.loading = false;
                localStorage.setItem("cartItems", JSON.stringify(state.cartItems));
            })
            .addCase(removeItemFromCart.rejected, (state, action) => {
                state.loading = false;
                state.error =
                    action.payload ||
                    action.error?.message ||
                    "Failed to remove item";
            });
    },
});

// ✅ Correct export
export const { removeItemFromCartLocal, saveShippingInfo, removeErrors, removeMessage } = cartSlice.actions;
export default cartSlice.reducer;
