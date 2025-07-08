import { configureStore } from "@reduxjs/toolkit";
import { apiCategory } from "../services/apiCategory";
import { authApi } from "../services/authApi";
import { apiProfile } from "../services/apiProfile"; // додай імпорт
import authReducer from "../slices/authSlice";
import {
    useDispatch,
    type TypedUseSelectorHook,
    useSelector,
} from "react-redux";

export const store = configureStore({
    reducer: {
        [apiCategory.reducerPath]: apiCategory.reducer,
        [authApi.reducerPath]: authApi.reducer,
        [apiProfile.reducerPath]: apiProfile.reducer,  // додай сюди
        auth: authReducer,
    },
    middleware: (getDefaultMiddleware) =>
        getDefaultMiddleware()
            .concat(apiCategory.middleware, authApi.middleware, apiProfile.middleware), // і сюди
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;

export const useAppDispatch = () => useDispatch<AppDispatch>();
export const useAppSelector: TypedUseSelectorHook<RootState> = useSelector;
