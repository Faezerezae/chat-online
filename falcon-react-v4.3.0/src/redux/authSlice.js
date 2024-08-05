import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axiosInstance from '../axios/axiosConfig';

const initialState = {
    user: JSON.parse(localStorage.getItem('user')) || null,
    status: 'idle',
    error: null
};

export const login = createAsyncThunk(
    'auth/login',
    async ({ username, password }) => {
        const response = await axiosInstance.post('auth/login', {
            username,
            password
        });
        return response.data;
    }
);

const authSlice = createSlice({
    name: 'auth',
    initialState,
    reducers: {
        logout: state => {
            state.user = null;
            localStorage.removeItem('user');
        }
    },
    extraReducers: builder => {
        builder
            .addCase(login.pending, state => {
                state.status = 'loading';
            })
            .addCase(login.fulfilled, (state, action) => {
                state.status = 'succeeded';
                state.user = action.payload.user;
                localStorage.setItem(
                    'user',
                    JSON.stringify(action.payload.user)
                );
            })
            .addCase(login.rejected, (state, action) => {
                state.status = 'failed';
                state.error = action.error.message;
            });
    }
});

export const { logout } = authSlice.actions;

export default authSlice.reducer;
