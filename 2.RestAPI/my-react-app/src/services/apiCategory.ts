import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';
import type { ICategoryItem, ICategoryCreate } from './types';

export const apiCategory = createApi({
   reducerPath: 'api',
   baseQuery: fetchBaseQuery({ baseUrl: 'http://127.0.0.1:4096/api/' }),
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
      createCategory: builder.mutation<ICategoryItem, ICategoryCreate>({
         query: (newCategory) => ({
            url: 'categories/',
            method: 'POST',
            body: newCategory,
         }),
         invalidatesTags: ['Categories'],
      }),
      updateCategory: builder.mutation<
          ICategoryItem,
          { id: number; name: string; slug: string; description?: string }
      >({
         query: ({ id, ...patch }) => ({
            url: `categories/${id}/`,
            method: 'PUT',
            body: patch,
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
