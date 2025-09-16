import { createSlice } from "@reduxjs/toolkit";
import type { PayloadAction } from "@reduxjs/toolkit";

interface User {
    _id: string;
    name: string;
    email: string;
    role: string;
}

interface AuthState {
    isAuthenticated: boolean;
    user: User | null;
}

const getInitialState = (): AuthState => {
    try {
        const serializedUser = localStorage.getItem('user');
        if (serializedUser === null) {
            return {
                isAuthenticated: false,
                user: null,
            };
        }
        const user = JSON.parse(serializedUser);
        return {
            isAuthenticated: true,
            user,
        };
    } catch (e) {
        console.error("Failed to load state from localStorage", e);
        return {
            isAuthenticated: false,
            user: null,
        };
    }
};

const initialState: AuthState = getInitialState();

const authSlice = createSlice({
    name: "auth",
    initialState,
    reducers: {
        loginSuccess: (state, action: PayloadAction<User>) => {
            state.isAuthenticated = true;
            state.user = action.payload;
            localStorage.setItem('user', JSON.stringify(action.payload));
        },
        logout: (state) => {
            state.isAuthenticated = false;
            state.user = null;
            localStorage.removeItem('user')
        },
    },
});

export const { loginSuccess, logout } = authSlice.actions;
export default authSlice.reducer;
