
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
        getViewers: builder.query({            
            query: () => '/auth/viewers-list/',
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
                url: `/auth/update-user/${initialUser.id}/`,
                method: 'POST',
                body: initialUser.data
            }),
            invalidatesTags: ['User']
        }),
        updateUserApproval: builder.mutation({
            query: initialUser => ({
                url: `/auth/approve-user/${initialUser.id}/`,
                method: 'POST',
                body: initialUser.data
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
    useGetViewersQuery,
    useGetUserByUserIdQuery,
    useAddUserMutation,
    useUpdateUserMutation,
    useUpdateUserApprovalMutation,
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
