import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';
import type { LoginRequest, TokenResponse, User } from './types.ts';
import type { RootState } from '../store'; // імпорт типів стану

export const apiAuth = createApi({
    reducerPath: 'apiAuth',
    baseQuery: fetchBaseQuery({
        baseUrl: 'http://127.0.0.1:4096/api/',
        prepareHeaders: (headers, { getState }) => {
            const token =
                (getState() as RootState).auth.token ||
                localStorage.getItem('token');

            if (token) {
                headers.set('Authorization', `Bearer ${token}`);
            }

            return headers;
        },
    }),
    tagTypes: ['User'],
    endpoints: (builder) => ({
        register: builder.mutation<User, FormData>({
            query: (formData) => ({
                url: 'register/',
                method: 'POST',
                body: formData,
            }),
        }),
        login: builder.mutation<TokenResponse, LoginRequest>({
            query: (data) => ({
                url: 'token/',
                method: 'POST',
                body: data,
            }),
        }),
        getUser: builder.query<User, void>({
            query: () => 'user/',
            providesTags: ['User'],
        }),
    }),
});

export const {
    useRegisterMutation,
    useLoginMutation,
    useGetUserQuery,
} = apiAuth;
