import { createSlice } from '@reduxjs/toolkit';
import type { PayloadAction } from '@reduxjs/toolkit';
import type { User } from "../services/types.ts";

interface AuthState {
    user: User | null;
    token: string | null;
}

const tokenFromStorage = localStorage.getItem('token');
const userFromStorage = localStorage.getItem('user');

const initialState: AuthState = {
    user: userFromStorage ? JSON.parse(userFromStorage) : null,
    token: tokenFromStorage,
};

const authSlice = createSlice({
    name: 'auth',
    initialState,
    reducers: {
        setCredentials: (state, action: PayloadAction<{ user: User, token: string }>) => {
            const { user, token } = action.payload;
            console.log("🔥 setCredentials reducer:", action.payload); // для перевірки
            state.user = user;
            state.token = token;
            localStorage.setItem('token', token);
            localStorage.setItem('user', JSON.stringify(user));
        },
        logout: (state) => {
            state.user = null;
            state.token = null;
            localStorage.removeItem('token');
            localStorage.removeItem('user');
        },
    },
});

export const { setCredentials, logout } = authSlice.actions;
export default authSlice.reducer;
