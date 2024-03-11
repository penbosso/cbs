
import { apiSlice } from "./apiSlice";

export const authService = apiSlice.injectEndpoints({
    endpoints: builder => ({
        login: builder.mutation({
            query: credentials => ({
                url: '/auth/login/',
                method: 'POST',
                body: { ...credentials }
            })
        }),
        resetPassword: builder.mutation({
            
            invalidatesTags: [
                { type: 'Auth', id: "LIST" }
            ]
        }),
    })
})

export const {
    useLoginMutation,
    useResetPasswordMutation
} = authService;

export const logout = async () => {
}