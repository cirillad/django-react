import { fetchBaseQuery } from '@reduxjs/toolkit/query/react';
import type { BaseQueryFn } from '@reduxjs/toolkit/query/react';

const baseQuery = fetchBaseQuery({
    baseUrl: 'http://localhost:4096/api/',
    prepareHeaders: (headers) => {
        const token = localStorage.getItem('access_token');
        if (token) {
            headers.set('Authorization', `Bearer ${token}`);
        }
        return headers;
    },
});

interface RefreshResponse {
    access: string;
}

export const baseQueryWithReauth: BaseQueryFn<
    string | { url: string; method?: string; body?: unknown },
    unknown,
    unknown
> = async (args, api, extraOptions) => {
    let result = await baseQuery(args, api, extraOptions);

    if (result.error && result.error.status === 401) {
        const refreshToken = localStorage.getItem('refresh_token');

        if (!refreshToken) {
            localStorage.removeItem('access_token');
            localStorage.removeItem('refresh_token');
            return result;
        }

        const refreshResult = await baseQuery(
            {
                url: 'auth/token/refresh/',
                method: 'POST',
                body: { refresh: refreshToken },
            },
            api,
            extraOptions
        );

        if (refreshResult.data) {
            const data = refreshResult.data as RefreshResponse;
            localStorage.setItem('access_token', data.access);
            // Повторити початковий запит з оновленим токеном
            result = await baseQuery(args, api, extraOptions);
        } else {
            localStorage.removeItem('access_token');
            localStorage.removeItem('refresh_token');
            // тут можна диспатчити logout або робити редірект
        }
    }

    return result;
};
