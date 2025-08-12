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
            console.log('Registration error:', error);
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
                headers: {
                    'Content-type': 'multipart/form-data'
                }
            };
            const { data } = await axios.put('/api/v1/profile/update', userData, config);
            return data;
        } catch (error) {
            return rejectWithValue(
                error.response?.data?.message || { message: "Profile update failed please try again later" }
            );
        }
    }
);


// SLICE
const userSlice = createSlice({
    name: 'user',
    initialState: {
        user: null,
        loading: false,
        error: null,
        success: false,
        isAuthenticated: false,
        message: null
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
                state.success = false;
            })
            .addCase(loginUser.fulfilled, (state, action) => {
                state.loading = false;
                state.success = Boolean(action.payload.success);
                state.user = action.payload?.user || null;
                state.isAuthenticated = Boolean(action.payload?.user);
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
            })
            .addCase(loadUser.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload;
                state.user = null;
                state.isAuthenticated = false;
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
                state.success = false;
            })
            .addCase(logoutUser.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload;
            });

        // UPDATE USER PROFILE
        builder
            .addCase(updateProfile.pending, (state) => {
                state.loading = true;
                state.error = null;
                state.success = false; // reset previous success state
            })
            .addCase(updateProfile.fulfilled, (state, action) => {
                state.loading = false;
                state.user = action.payload?.user || state.user; // keep old data if no user in payload
                state.success = true;
                state.message = action.payload?.message || 'Profile updated successfully';
            })
            .addCase(updateProfile.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload || 'Failed to update profile';
                state.success = false;
            });

    }
});

export const { removeErrors, removeSuccess } = userSlice.actions;
export default userSlice.reducer;
