
import { createSelector, createEntityAdapter } from "@reduxjs/toolkit";
import { apiSlice } from "./apiSlice";

const componentsAdapter = createEntityAdapter();
const initialState = componentsAdapter.getInitialState();


export const componentService = apiSlice.injectEndpoints({
    endpoints: builder => ({
        getComponents: builder.query({
            query: () => '/market/component-list/',
            providesTags: ['Component']
        }),
        getUserLocationComponents: builder.query({
            query: () => '/market/user-location-component-list/',
            providesTags: ['Component']
        }),
        getComponentByComponentId: builder.query({
            query: id => `/market/${id}`,
            transformResponse: responseData => {
                const loadedComponents = responseData.map(component => {
                    return component;
                });
                return componentsAdapter.setAll(initialState, loadedComponents)
            },
            providesTags: ['Component']
        }),
        addComponent: builder.mutation({
            query: initialComponent => ({
                url: '/market/component-create/',
                method: 'POST',
                body: {
                    ...initialComponent,
                    componentId: Number(initialComponent.componentId),
                    date: new Date().toISOString(),
                }
            }),
            invalidatesTags: ['Component']
        }),
        updateComponent: builder.mutation({
            query: initialComponent => ({
                url: `/market/component-update/${initialComponent.id}/`,
                method: 'PUT',
                body: initialComponent.values
            }),
            invalidatesTags: ['Component']
        }),
        deleteComponent: builder.mutation({
            query: ({ id }) => ({
                url: `/market/delete-update/${id}/`,
                method: 'DELETE',
                body: { id }
            }),
            invalidatesTags: ['Component']
        }),
    })
})

export const {
    useGetComponentsQuery,
    useGetUserLocationComponentsQuery,
    useGetComponentByComponentIdQuery,
    useAddComponentMutation,
    useUpdateComponentMutation,
    useDeleteComponentMutation
} = componentService;

export const selectComponentResult = componentService.endpoints.getComponents.select()
const selectComponentsData = createSelector(
    selectComponentResult,
    componentsResult => componentsResult.data
)

export const {
    selectAll: selectAllComponents,
    selectById: selectComponentById,
    selectIds: selectComponentIds
} = componentsAdapter.getSelectors(state => selectComponentsData(state) ?? initialState);
