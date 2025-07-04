import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';
import type { ICategoryItem } from './types';

export const apiCategory = createApi({
   reducerPath: 'api',
   baseQuery: fetchBaseQuery({
      baseUrl: 'http://127.0.0.1:4096/api/',
      prepareHeaders: (headers, { getState }) => {
         // Витягуємо токен зі стану Redux
         const token = (getState() as any).auth.token;
         if (token) {
            headers.set('Authorization', `Bearer ${token}`);
         }
         return headers;
      },
   }),
   tagTypes: ['Categories'],
   endpoints: (builder) => ({
      getCategories: builder.query<ICategoryItem[], void>({
         query: () => 'categories/',
         providesTags: ['Categories'],
      }),
      getCategory: builder.query<ICategoryItem, number>({
         query: (id) => `categories/${id}/`,
         providesTags: ['Categories'],
      }),
      deleteCategory: builder.mutation<void, number>({
         query: (id) => ({
            url: `categories/${id}/`,
            method: 'DELETE',
         }),
         invalidatesTags: ['Categories'],
      }),
      createCategory: builder.mutation<ICategoryItem, FormData>({
         query: (formData) => ({
            url: 'categories/',
            method: 'POST',
            body: formData,
         }),
         invalidatesTags: ['Categories'],
      }),
      updateCategory: builder.mutation<
          ICategoryItem,
          { id: number; formData: FormData }
      >({
         query: ({ id, formData }) => ({
            url: `categories/${id}/`,
            method: 'PUT',
            body: formData,
         }),
         invalidatesTags: ['Categories'],
      }),
   }),
});

export const {
   useGetCategoriesQuery,
   useGetCategoryQuery,
   useDeleteCategoryMutation,
   useCreateCategoryMutation,
   useUpdateCategoryMutation,
} = apiCategory;
