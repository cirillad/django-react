import {createApi} from "@reduxjs/toolkit/query/react";
import type {ICategoryItem} from "./types";
import {createBaseQuery} from "../utils/createBaseQuery.ts";

export const apiCategory = createApi({
   reducerPath: 'api',
   baseQuery: createBaseQuery("categories"),
   tagTypes: ["Categories"],
   endpoints: (builder) => ({
      getCategories:  builder.query<ICategoryItem[], void>({
         query: () => '',
         providesTags: ['Categories'],
      }),

      createCategory: builder.mutation<ICategoryItem, FormData>({
         query: (formData) => ({
            url: "/",
            method: "POST",
            body: formData,
         }),
         invalidatesTags: ["Categories"],
      }),

      deleteCategory: builder.mutation<void, number>({
         query: (id) => ({
            url: `${id}/`,
            method: "DELETE",
         }),
         invalidatesTags: ["Categories"],
      }),

      getCategory: builder.query<ICategoryItem, number>({
         query: (id) => `/${id}/`,
         providesTags: ["Categories"],
      }),
      updateCategory: builder.mutation<ICategoryItem, { id: number; formData: FormData }>({
         query: ({ id, formData }) => ({
            url: `/${id}/`,
            method: "PUT",
            body: formData,
         }),
         invalidatesTags: ["Categories"],
      }),

   })

});


export const {
   useGetCategoriesQuery,
   useDeleteCategoryMutation,
    useCreateCategoryMutation,
   useGetCategoryQuery,
   useUpdateCategoryMutation,
} = apiCategory;