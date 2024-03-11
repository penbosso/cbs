
import { createSelector, createEntityAdapter } from "@reduxjs/toolkit";
import { apiSlice } from "./apiSlice";

const districtsAdapter = createEntityAdapter();
const initialState = districtsAdapter.getInitialState();


export const districtService = apiSlice.injectEndpoints({
    endpoints: builder => ({
        getDistricts: builder.query({
            query: () => '/market/location-list/',
            providesTags: ['District']
        }),
        getDistrictByDistrictId: builder.query({
            query: id => `/districts/${id}`,
            transformResponse: responseData => {
                const loadedDistricts = responseData.map(district => {
                    return district;
                });
                return districtsAdapter.setAll(initialState, loadedDistricts)
            },
            providesTags: ['District']
        }),
        addDistrict: builder.mutation({
            query: initialDistrict => ({
                url: '/districts',
                method: 'POST',
                body: {
                    ...initialDistrict,
                    districtId: Number(initialDistrict.districtId),
                    date: new Date().toISOString(),
                }
            }),
            invalidatesTags: ['District']
        }),
        updateDistrict: builder.mutation({
            query: initialDistrict => ({
                url: `/districts/${initialDistrict.id}`,
                method: 'PUT',
                body: {
                    ...initialDistrict,
                    date: new Date().toISOString()
                }
            }),
            invalidatesTags: ['District']
        }),
        deleteDistrict: builder.mutation({
            query: ({ id }) => ({
                url: `/districts/${id}`,
                method: 'DELETE',
                body: { id }
            }),
            invalidatesTags: ['District']
        }),
    })
})

export const {
    useGetDistrictsQuery,
    useGetDistrictByDistrictIdQuery,
    useAddDistrictMutation,
    useUpdateDistrictMutation,
    useDeleteDistrictMutation
} = districtService;

export const selectDistrictResult = districtService.endpoints.getDistricts.select()
const selectDistrictsData = createSelector(
    selectDistrictResult,
    districtsResult => districtsResult.data
)

export const {
    selectAll: selectAllDistricts,
    selectById: selectDistrictById,
    selectIds: selectDistrictIds
} = districtsAdapter.getSelectors(state => selectDistrictsData(state) ?? initialState);
