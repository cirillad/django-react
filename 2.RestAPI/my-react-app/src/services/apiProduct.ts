// src/services/apiProduct.ts
import { createApi } from '@reduxjs/toolkit/query/react';
import {baseQueryWithReauth} from "./baseQuery.ts";

export interface ProductImageData {
    id: number;
    image_url: string;
}

export interface Product {
    id: number;
    name: string;
    description: string;
    price: number;
    category: number;
    images_data: ProductImageData[]; // ✅ ОНОВЛЕНО!
}

export const apiProduct = createApi({
    reducerPath: 'apiProduct',
    baseQuery: baseQueryWithReauth,
    tagTypes: ['Product'],
    endpoints: (builder) => ({
        getProductsByCategory: builder.query<Product[], number>({
            query: (categoryId) => `products/?category=${categoryId}`,
            providesTags: (result) =>
                result
                    ? [
                        ...result.map(({ id }) => ({ type: 'Product' as const, id })),
                        { type: 'Product', id: 'LIST' },
                    ]
                    : [{ type: 'Product', id: 'LIST' }],
        }),

        getProductById: builder.query<Product, number>({
            query: (id) => `products/${id}/`,
            providesTags: (_result, _error, id) => [{ type: 'Product', id }],
        }),

        addProduct: builder.mutation<Product, FormData>({
            query: (formData) => ({
                url: 'products/',
                method: 'POST',
                body: formData,
                // При FormData не треба додавати 'Content-Type', браузер сам поставить multipart/form-data
            }),
            invalidatesTags: [{ type: 'Product', id: 'LIST' }],
        }),

        updateProduct: builder.mutation<Product, Partial<Product> & Pick<Product, 'id'>>({
            query: ({ id, ...patch }) => ({
                url: `products/${id}/`,
                method: 'PUT',
                body: patch,
            }),
            invalidatesTags: (_result, _error, { id }) => [{ type: 'Product', id }],
        }),

        deleteProduct: builder.mutation<void, number>({
            query: (id) => ({
                url: `products/${id}/`,
                method: 'DELETE',
            }),
            invalidatesTags: [{ type: 'Product', id: 'LIST' }],
        }),
    }),
});


export const {
    useGetProductsByCategoryQuery,
    useGetProductByIdQuery,
    useAddProductMutation,
    useUpdateProductMutation,
    useDeleteProductMutation,
} = apiProduct;
