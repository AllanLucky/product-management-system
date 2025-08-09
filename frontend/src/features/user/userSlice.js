import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';

// REGISTER API
export const registerUser = createAsyncThunk(
    'user/register',
    async (userData, { rejectWithValue }) => {
        try {
            const config = {
                headers: {
                    'Content-Type': 'multipart/form-data'
                }
            };
            const { data } = await axios.post('/api/v1/register', userData, config);
            return data;
        } catch (error) {
            console.log('Registration data');
            return rejectWithValue(
                error.response?.data?.message || 'Registration failed. Please try again later.'
            );
        }
    }
);

// LOGIN
export const loginUser = createAsyncThunk(
    'user/login',
    async (credentials, { rejectWithValue }) => {
        try {
            const config = { headers: { 'Content-Type': 'application/json' } };
            const { data } = await axios.post('/api/v1/login', credentials, config);
            return data; // { success: boolean, user?: object }
        } catch (error) {
            return rejectWithValue(
                error.response?.data?.message || 'Login failed. Please try again later.'
            );
        }
    }
);
const userSlice = createSlice({
    name: 'user',
    initialState: {
        user: null,
        loading: false,
        error: null,
        success: false,
        isAuthenticated: false
    },
    reducers: {
        removeErrors: (state) => {
            state.error = null;
        },
        removeSuccess: (state) => {
            state.success = null;
        }
    },
    extraReducers: (builder) => {
        builder
            // REGISTER
            .addCase(registerUser.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(registerUser.fulfilled, (state, action) => {
                state.loading = false;
                state.error = null;
                state.success = action.payload.success;

                // 🚫 Do not log user in after registration
                state.user = action.payload?.user || null;
                state.isAuthenticated = Boolean(action.payload?.user);
            })
            .addCase(registerUser.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload || "Registration failed. Please try again later";
                state.user = null;
                state.isAuthenticated = false;
            })

            // LOGIN
            .addCase(loginUser.pending, (state) => {
                state.loading = true;
                state.error = null;
                state.success = false;
            })
            .addCase(loginUser.fulfilled, (state, action) => {
                state.loading = false;
                state.error = null;
                state.success = Boolean(action.payload.success);
                state.user = action.payload?.user || null;
                state.isAuthenticated = Boolean(action.payload?.user);
            })
            .addCase(loginUser.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload;
                state.success = false;
                state.user = null;
                state.isAuthenticated = false;
            });
    }
});

export const { removeErrors, removeSuccess } = userSlice.actions;
export default userSlice.reducer;
