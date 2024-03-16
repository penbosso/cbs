
import { createSelector, createEntityAdapter } from "@reduxjs/toolkit";
import { apiSlice } from "./apiSlice";

const marketrecordsAdapter = createEntityAdapter();
const initialState = marketrecordsAdapter.getInitialState();


export const marketrecordService = apiSlice.injectEndpoints({
    endpoints: builder => ({
        getMarketRecords: builder.query({
            query: () => '/market/all-report-list/',
            providesTags: ['MarketRecord']
        }),
        getUserMarketRecords: builder.query({
            query: (user) => {
                if (user?.role.toLowerCase() == 'admin') {
                    return '/market/all-report-list/'
                } else if (user?.role.toLowerCase() == 'creator') {
                    return '/market/user-report-list/'
                } else {
                    return '/market/location-report-list'
                }
            },
            providesTags: ['MarketRecord']
        }),
        getMarketRecordByMarketRecordId: builder.query({
            query: id => `/marketrecords/${id}`,
            providesTags: ['MarketRecord']
        }),
        getMarketRecordCommentsByMarketRecordId: builder.query({
            query: id => `/market/report-comments/${id}/`,
            providesTags: ['MarketRecord']
        }),
        addMarketRecord: builder.mutation({
            query: initialMarketRecord => ({
                url: '/market/report-create/',
                method: 'POST',
                body: {
                    ...initialMarketRecord,
                    marketrecordId: Number(initialMarketRecord.marketrecordId),
                    date: new Date().toISOString(),
                }
            }),
            invalidatesTags: ['MarketRecord']
        }),
        updateMarketRecordProgress: builder.mutation({
            query: initialMarketRecord => ({
                url: `/market/report-approve/${initialMarketRecord.id}/`,
                method: 'POST',
                body: initialMarketRecord.data
            }),
            invalidatesTags: ['MarketRecord']
        }),
        updateMarketRecord: builder.mutation({
            query: initialMarketRecord => ({
                url: `/market/report-update/5${initialMarketRecord.id}/`,
                method: 'PUT',
                body: {
                    ...initialMarketRecord,
                    date: new Date().toISOString()
                }
            }),
            invalidatesTags: ['MarketRecord']
        }),
        deleteMarketRecord: builder.mutation({
            query: ({ id }) => ({
                url: `/marketrecords/${id}`,
                method: 'DELETE',
                body: { id }
            }),
            invalidatesTags: ['MarketRecord']
        }),
    })
})

export const {
    useGetMarketRecordsQuery,
    useGetUserMarketRecordsQuery,
    useGetMarketRecordCommentsByMarketRecordIdQuery,
    useGetMarketRecordByMarketRecordIdQuery,
    useAddMarketRecordMutation,
    useUpdateMarketRecordProgressMutation,
    useUpdateMarketRecordMutation,
    useDeleteMarketRecordMutation
} = marketrecordService;

export const selectMarketRecordResult = marketrecordService.endpoints.getMarketRecords.select()
const selectMarketRecordsData = createSelector(
    selectMarketRecordResult,
    marketrecordsResult => marketrecordsResult.data
)

export const {
    selectAll: selectAllMarketRecords,
    selectById: selectMarketRecordById,
    selectIds: selectMarketRecordIds
} = marketrecordsAdapter.getSelectors(state => selectMarketRecordsData(state) ?? initialState);
