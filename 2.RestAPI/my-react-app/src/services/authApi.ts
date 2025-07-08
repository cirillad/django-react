import { createApi } from "@reduxjs/toolkit/query/react";
import {createBaseQuery} from "../utils/createBaseQuery.ts";

export const authApi = createApi({
    reducerPath: "authApi",
    baseQuery: createBaseQuery(""),
    endpoints: (builder) => ({
        register: builder.mutation({
            query: (data) => ({
                url: "register/",
                method: "POST",
                body: data,
            }),
        }),
        login: builder.mutation({
            query: (data) => ({
                url: "login/",
                method: "POST",
                body: data,
            }),
        }),
        googleLogin: builder.mutation({
            query: (data) => ({
              url: "google-login/",
              method: "POST",
              body: data,
            }),
          }),
    }),
});

export const { useRegisterMutation, useLoginMutation, useGoogleLoginMutation } = authApi;