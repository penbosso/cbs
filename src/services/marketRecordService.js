
import { createSelector, createEntityAdapter } from "@reduxjs/toolkit";
import { apiSlice } from "./apiSlice";

const marketrecordsAdapter = createEntityAdapter();
const initialState = marketrecordsAdapter.getInitialState();


export const marketrecordService = apiSlice.injectEndpoints({
    endpoints: builder => ({
        getMarketRecords: builder.query({            
            query: () => '/market/location-list/',
            providesTags: ['MarketRecord']
        }),
        getMarketRecordByMarketRecordId: builder.query({
            query: id => `/marketrecords/${id}`,
            providesTags: ['MarketRecord']
        }),
        addMarketRecord: builder.mutation({
            query: initialMarketRecord => ({
                url: '/marketrecords',
                method: 'POST',
                body: {
                    ...initialMarketRecord,
                    marketrecordId: Number(initialMarketRecord.marketrecordId),
                    date: new Date().toISOString(),
                }
            }),
            invalidatesTags: ['MarketRecord']
        }),
        updateMarketRecord: builder.mutation({
            query: initialMarketRecord => ({
                url: `/marketrecords/${initialMarketRecord.id}`,
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
    useGetMarketRecordByMarketRecordIdQuery,
    useAddMarketRecordMutation,
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
