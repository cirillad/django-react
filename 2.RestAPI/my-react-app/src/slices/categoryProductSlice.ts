// src/services/apiSlice.ts
import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';

export interface ISearch {
    objectName: string;
    id: string;
}

export const apiSlice = createApi({
    reducerPath: 'api',
    baseQuery: fetchBaseQuery({
        baseUrl: 'https://localhost:8080/api/v1',
    }),
    tagTypes: ['Record'],
    endpoints: (builder) => ({
        getRecord: builder.query<unknown, ISearch>({
            query: (params) => `/${params.objectName}/${params.id}`,
            providesTags: (_result, _error, arg) => [
                { type: 'Record', id: `${arg.objectName}/${arg.id}` }
            ],
        }),
    }),
});

export const { useGetRecordQuery } = apiSlice;
