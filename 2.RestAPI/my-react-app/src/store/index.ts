import { configureStore } from "@reduxjs/toolkit";
import { apiCategory } from "../services/apiCategory";
import { useDispatch, type TypedUseSelectorHook, useSelector } from "react-redux";


export const store = configureStore({
    reducer: {
        [apiCategory.reducerPath]: apiCategory.reducer
    },
    middleware: (getDefaultMiddleware) => 
        getDefaultMiddleware().concat(apiCategory.middleware)
})

export type RootState = ReturnType<typeof store.getState>;
export type AddDispatch = typeof store.dispatch;

export const UseAppDisptacth: () => AddDispatch = useDispatch
export const UseAppSelector: TypedUseSelectorHook<RootState> = useSelector