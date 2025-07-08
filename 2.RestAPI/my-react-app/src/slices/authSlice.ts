import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import type { PayloadAction } from "@reduxjs/toolkit";
import axios from "axios";
import { APP_ENV } from "../env"; // якщо у тебе є APP_ENV.API_BASE_URL

type User = {
  username: string;
  email?: string;
  phone?: string;
  image?: string;
  id: string | number;
};

interface AuthState {
  user: User | null;
  token: string | null;
}

const tokenFromStorage = localStorage.getItem("token");
const userFromStorage = localStorage.getItem("user");

const initialState: AuthState = {
  token: tokenFromStorage,
  user: userFromStorage ? JSON.parse(userFromStorage) : null,
};

export const getProfile = createAsyncThunk(
    "auth/getProfile",
    async (_, thunkAPI) => {
      try {
        const token = (thunkAPI.getState() as { auth: AuthState }).auth.token;
        const response = await axios.get(`${APP_ENV.API_BASE_URL}/api/profile/`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        return response.data;
      } catch (error) {
        const err = error as AxiosError;

        if (err.response) {
          return thunkAPI.rejectWithValue(err.response.data);
        }

        return thunkAPI.rejectWithValue("Unknown error");
      }
    }
);

const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    setCredentials: (
        state,
        action: PayloadAction<{ access: string; user: User }>
    ) => {
      const { access, user } = action.payload;

      state.token = access;
      state.user = user;

      localStorage.setItem("token", access);
      localStorage.setItem("user", JSON.stringify(user));
    },

    logout: (state) => {
      state.user = null;
      state.token = null;
      localStorage.removeItem("token");
      localStorage.removeItem("user");
    },
  },
  extraReducers: (builder) => {
    builder.addCase(getProfile.fulfilled, (state, action) => {
      state.user = action.payload;
      localStorage.setItem("user", JSON.stringify(action.payload));
    });
  },
});

export const { setCredentials, logout } = authSlice.actions;
export default authSlice.reducer;
