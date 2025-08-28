import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';

// REGISTER API
export const registerUser = createAsyncThunk(
    'user/register',
    async (userData, { rejectWithValue }) => {
        try {
            const config = {
                headers: { 'Content-Type': 'multipart/form-data' },
                withCredentials: true
            };
            const { data } = await axios.post('/api/v1/register', userData, config);
            return data;
        } catch (error) {
            console.error('Registration error:', error);
            return rejectWithValue(
                error.response?.data?.message || 'Registration failed. Please try again later.'
            );
        }
    }
);

// LOGIN API
export const loginUser = createAsyncThunk(
    'user/login',
    async (credentials, { rejectWithValue }) => {
        try {
            const config = {
                headers: { 'Content-Type': 'application/json' },
                withCredentials: true
            };
            const { data } = await axios.post('/api/v1/login', credentials, config);
            return data;
        } catch (error) {
            return rejectWithValue(
                error.response?.data?.message || 'Login failed. Please try again later.'
            );
        }
    }
);

// LOAD USER API
export const loadUser = createAsyncThunk(
    'user/loadUser',
    async (_, { rejectWithValue }) => {
        try {
            const { data } = await axios.get('/api/v1/profile', { withCredentials: true });
            return data;
        } catch (error) {
            return rejectWithValue(
                error.response?.data?.message || 'Failed to load user profile.'
            );
        }
    }
);

// LOGOUT API
export const logoutUser = createAsyncThunk(
    'user/logout',
    async (_, { rejectWithValue }) => {
        try {
            const { data } = await axios.get('/api/v1/logout', { withCredentials: true });
            return data;
        } catch (error) {
            return rejectWithValue(
                error.response?.data?.message || 'Logout failed. Please try again later.'
            );
        }
    }
);

// UPDATE USER PROFILE
export const updateProfile = createAsyncThunk(
    'user/updateProfile',
    async (userData, { rejectWithValue }) => {
        try {
            const config = {
                headers: { 'Content-Type': 'multipart/form-data' }
            };
            const { data } = await axios.put('/api/v1/profile/update', userData, config);
            return data;
        } catch (error) {
            return rejectWithValue(
                error.response?.data?.message || 'Profile update failed. Please try again later.'
            );
        }
    }
);

// UPDATE PASSWORD
export const updatePassword = createAsyncThunk(
    'user/updatePassword',
    async (userData, { rejectWithValue }) => {
        try {
            const config = {
                headers: { 'Content-Type': 'application/json' }
            };
            const { data } = await axios.put('/api/v1/password/update', userData, config);
            return data;
        } catch (error) {
            return rejectWithValue(
                error.response?.data?.message || 'Failed to update password'
            );
        }
    }
);

// FORGOT PASSWORD
export const forgotPassword = createAsyncThunk(
    'user/forgotPassword',
    async (userData, { rejectWithValue }) => {
        try {
            const config = {
                headers: { 'Content-Type': 'application/json' }
            };
            const { data } = await axios.post('/api/v1/password/forgot', userData, config);
            return data;
        } catch (error) {
            return rejectWithValue(
                error.response?.data?.message || 'Failed to send reset link'
            );
        }
    }
);

// RESET PASSWORD
export const resetPassword = createAsyncThunk(
    "user/resetPassword",
    async ({ token, userData }, { rejectWithValue }) => {
        try {
            const config = {
                headers: { "Content-Type": "application/json" },
            };
            const { data } = await axios.post(`/api/v1/reset/${token}`, userData, config);
            return data;
        } catch (error) {
            return rejectWithValue(
                error.response?.data?.message || "Failed to reset password"
            );
        }
    }
);

// SLICE
const userSlice = createSlice({
    name: 'user',
    initialState: {
        user: localStorage.getItem("user") ? JSON.parse(localStorage.getItem("user")) : null,
        loading: false,
        error: null,
        success: false,
        isAuthenticated: localStorage.getItem("isAuthenticated")
            ? JSON.parse(localStorage.getItem("isAuthenticated"))
            : false,
        message: null
    },
    reducers: {
        removeErrors: (state) => {
            state.error = null;
        },
        removeSuccess: (state) => {
            state.success = false;
            state.message = null;
        }
    },
    extraReducers: (builder) => {
        // REGISTER USER
        builder
            .addCase(registerUser.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(registerUser.fulfilled, (state, action) => {
                state.loading = false;
                state.success = action.payload.success;
                state.user = action.payload?.user || null;
                state.isAuthenticated = Boolean(action.payload?.user);

                localStorage.setItem("user", JSON.stringify(state.user));
                localStorage.setItem("isAuthenticated", JSON.stringify(state.isAuthenticated));
            })
            .addCase(registerUser.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload;
                state.user = null;
                state.isAuthenticated = false;
            });

        // LOGIN USER
        builder
            .addCase(loginUser.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(loginUser.fulfilled, (state, action) => {
                state.loading = false;
                state.success = Boolean(action.payload.success);
                state.user = action.payload?.user || null;
                state.isAuthenticated = Boolean(action.payload?.user);

                localStorage.setItem("user", JSON.stringify(state.user));
                localStorage.setItem("isAuthenticated", JSON.stringify(state.isAuthenticated));
            })
            .addCase(loginUser.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload;
                state.user = null;
                state.isAuthenticated = false;
            });

        // LOAD USER
        builder
            .addCase(loadUser.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(loadUser.fulfilled, (state, action) => {
                state.loading = false;
                state.user = action.payload?.user || null;
                state.isAuthenticated = Boolean(action.payload?.user);

                localStorage.setItem("user", JSON.stringify(state.user));
                localStorage.setItem("isAuthenticated", JSON.stringify(state.isAuthenticated));
            })
            .addCase(loadUser.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload;
                state.user = null;
                state.isAuthenticated = false;

                // ✅ Ensure cleanup when unauthorized
                localStorage.removeItem("user");
                localStorage.removeItem("isAuthenticated");
            });

        // LOGOUT USER
        builder
            .addCase(logoutUser.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(logoutUser.fulfilled, (state) => {
                state.loading = false;
                state.user = null;
                state.isAuthenticated = false;

                localStorage.removeItem("user");
                localStorage.removeItem("isAuthenticated");
            })
            .addCase(logoutUser.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload;

                localStorage.removeItem("user");
                localStorage.removeItem("isAuthenticated");
            });

        // UPDATE PROFILE
        builder
            .addCase(updateProfile.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(updateProfile.fulfilled, (state, action) => {
                state.loading = false;
                state.user = action.payload?.user || state.user;
                state.success = true;
                state.message = action.payload?.message || 'Profile updated successfully';

                localStorage.setItem("user", JSON.stringify(state.user));
            })
            .addCase(updateProfile.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload || 'Failed to update profile';
            });

        // UPDATE PASSWORD
        builder
            .addCase(updatePassword.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(updatePassword.fulfilled, (state, action) => {
                state.loading = false;
                state.success = true;
                state.message = action.payload?.message || 'Password updated successfully';
            })
            .addCase(updatePassword.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload || 'Failed to update password';
            });

        // FORGOT PASSWORD
        builder
            .addCase(forgotPassword.pending, (state) => {
                state.loading = true;
                state.error = null;
                state.success = false;
                state.message = null;
            })
            .addCase(forgotPassword.fulfilled, (state, action) => {
                state.loading = false;
                state.success = Boolean(action.payload?.success);
                state.message = action.payload?.message;
            })
            .addCase(forgotPassword.rejected, (state, action) => {
                state.loading = false;
                state.success = false;
                state.error = action.payload || 'Failed to send password reset email';
            });

        // RESET PASSWORD
        builder
            .addCase(resetPassword.pending, (state) => {
                state.loading = true;
                state.error = null;
                state.success = false;
                state.message = null;
            })
            .addCase(resetPassword.fulfilled, (state, action) => {
                state.loading = false;
                state.success = Boolean(action.payload?.success);
                state.message = action.payload?.message || "Password reset successful";
            })
            .addCase(resetPassword.rejected, (state, action) => {
                state.loading = false;
                state.success = false;
                state.error = action.payload || "Failed to reset password";
            });
    }
});

export const { removeErrors, removeSuccess } = userSlice.actions;
export default userSlice.reducer;
