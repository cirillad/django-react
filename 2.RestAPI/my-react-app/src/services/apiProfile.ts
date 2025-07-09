import { createApi } from "@reduxjs/toolkit/query/react";
import {baseQueryWithReauth} from "./baseQuery.ts"; // твоя базова функція запиту

interface IUserProfile {
    username: string;
    email: string;
    phone: string;
    image?: string;
}

interface IUpdateProfileRequest {
    username?: string;
    email?: string;
    phone?: string;
    old_password?: string;
    new_password?: string;
}

export const apiProfile = createApi({
    reducerPath: "apiProfile",
    baseQuery: baseQueryWithReauth,  // базовий URL /api/profile/
    tagTypes: ["Profile"],
    endpoints: (builder) => ({
        getProfile: builder.query<IUserProfile, void>({
            query: () => "", // GET /api/profile/
            providesTags: ["Profile"],
        }),
        updateProfile: builder.mutation<
            IUserProfile,
            IUpdateProfileRequest
        >({
            query: (data) => ({
                url: "",
                method: "PUT",
                body: data,
            }),
            invalidatesTags: ["Profile"],
        }),
    }),
});

export const {
    useGetProfileQuery,
    useUpdateProfileMutation,
} = apiProfile;
