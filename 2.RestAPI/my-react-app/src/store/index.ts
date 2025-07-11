// src/app/store.ts
import { configureStore } from "@reduxjs/toolkit";
import { apiCategory } from "../services/apiCategory";
import { authApi } from "../services/authApi";
import { apiProfile } from "../services/apiProfile";
import { apiProduct } from "../services/apiProduct";  // <-- додали apiProduct
import authReducer from "../slices/authSlice";
import { useDispatch, useSelector } from "react-redux";
import type { TypedUseSelectorHook } from "react-redux";

export const store = configureStore({
    reducer: {
        [apiCategory.reducerPath]: apiCategory.reducer,
        [authApi.reducerPath]: authApi.reducer,
        [apiProfile.reducerPath]: apiProfile.reducer,
        [apiProduct.reducerPath]: apiProduct.reducer,    // <-- додали reducer apiProduct
        auth: authReducer,
    },
    middleware: (getDefaultMiddleware) =>
        getDefaultMiddleware().concat(
            apiCategory.middleware,
            authApi.middleware,
            apiProfile.middleware,
            apiProduct.middleware   // <-- додали middleware apiProduct
        ),
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;

// Типізовані хуки для використання у компонентах
export const useAppDispatch = () => useDispatch<AppDispatch>();
export const useAppSelector: TypedUseSelectorHook<RootState> = useSelector;
