import {createApi} from "@reduxjs/toolkit/query/react";
import type {ICategoryCreate, ICategoryItem} from "./types";
import {createBaseQuery} from "../utils/createBaseQuery.ts";
import {serialize} from "object-to-formdata";

export const apiCategory = createApi({
   reducerPath: 'api',
   baseQuery: createBaseQuery("categories"),
   tagTypes: ["Categories"],
   endpoints: (builder) => ({
      getCategories:  builder.query<ICategoryItem[], void>({
         query: () => '',
         providesTags: ['Categories'],
      }),

      createCategory: builder.mutation<ICategoryItem, ICategoryCreate>({
         query: (newCategory) => {
            try {
               const formData = serialize(newCategory);
               return {
                  url: "/",
                  method: "POST",
                  body: formData,
               }
            }
            catch {
               throw new Error('Error create category');
            }
         },
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