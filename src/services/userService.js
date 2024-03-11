
import { createSelector, createEntityAdapter } from "@reduxjs/toolkit";
import { apiSlice } from "./apiSlice";
import { useLoginMutation } from "./authService";

const usersAdapter = createEntityAdapter();
const initialState = usersAdapter.getInitialState();
const db ={}

export const userService = apiSlice.injectEndpoints({
    endpoints: builder => ({
        getUsers: builder.query({            
            query: () => '/auth/all-users/',
            providesTags: ['User']
        }),
        getUserByUserId: builder.query({
            query: id => `/users/${id}`,
            providesTags: ['User']
        }),
        addUser: builder.mutation({
            query: initialUser => ({
                url: '/auth/create-user/',
                method: 'POST',
                body: {
                    ...initialUser,
                    userId: Number(initialUser.userId),
                    date: new Date().toISOString(),
                }
            }),
            invalidatesTags: ['User']
        }),
        updateUser: builder.mutation({
            query: initialUser => ({
                url: `/users/${initialUser.id}`,
                method: 'PUT',
                body: {
                    ...initialUser,
                    date: new Date().toISOString()
                }
            }),
            invalidatesTags: ['User']
        }),
        deleteUser: builder.mutation({
            query: ({ id }) => ({
                url: `/users/${id}`,
                method: 'DELETE',
                body: { id }
            }),
            invalidatesTags: ['User']
        }),
    })
})

export const {
    useGetUsersQuery,
    useGetUserByUserIdQuery,
    useAddUserMutation,
    useUpdateUserMutation,
    useDeleteUserMutation
} = userService;

export const selectUserResult = userService.endpoints.getUsers.select()
const selectUsersData = createSelector(
    selectUserResult,
    usersResult => usersResult.data
)

export const {
    selectAll: selectAllUsers,
    selectById: selectUserById,
    selectIds: selectUserIds
} = usersAdapter.getSelectors(state => selectUsersData(state) ?? initialState);
