import { configureStore } from "@reduxjs/toolkit";
import { apiCategory } from "../services/apiCategory";
import { apiAuth } from "../services/apiAuth";
import authReducer from "./authSlice";

import { useDispatch, type TypedUseSelectorHook, useSelector } from "react-redux";

export const store = configureStore({
    reducer: {
        auth: authReducer,
        [apiCategory.reducerPath]: apiCategory.reducer,
        [apiAuth.reducerPath]: apiAuth.reducer,
    },
    middleware: (getDefaultMiddleware) =>
        getDefaultMiddleware().concat(apiCategory.middleware, apiAuth.middleware),
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;

export const useAppDispatch: () => AppDispatch = useDispatch;
export const useAppSelector: TypedUseSelectorHook<RootState> = useSelector;
