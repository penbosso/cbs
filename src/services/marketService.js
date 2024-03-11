
import { createSelector, createEntityAdapter } from "@reduxjs/toolkit";
import { apiSlice } from "./apiSlice";

const marketsAdapter = createEntityAdapter();
const initialState = marketsAdapter.getInitialState();


export const marketService = apiSlice.injectEndpoints({
    endpoints: builder => ({
        getMarkets: builder.query({
            query: () => '/market/market-list/',
            providesTags: ['Market']
        }),
        getMarketByMarketId: builder.query({
            query: id => `/markets/${id}`,
            transformResponse: responseData => {
                const loadedMarkets = responseData.map(market => {
                    return market;
                });
                return marketsAdapter.setAll(initialState, loadedMarkets)
            },
            providesTags: ['Market']
        }),
        addMarket: builder.mutation({
            query: initialMarket => ({
                url: '/markets/market-create/',
                method: 'POST',
                body: {
                    ...initialMarket,
                    marketId: Number(initialMarket.marketId),
                    date: new Date().toISOString(),
                }
            }),
            invalidatesTags: ['Market']
        }),
        updateMarket: builder.mutation({
            query: initialMarket => ({
                url: `/markets/${initialMarket.id}`,
                method: 'PUT',
                body: {
                    ...initialMarket,
                    date: new Date().toISOString()
                }
            }),
            invalidatesTags: ['Market']
        }),
        deleteMarket: builder.mutation({
            query: ({ id }) => ({
                url: `/markets/${id}`,
                method: 'DELETE',
                body: { id }
            }),
            invalidatesTags: ['Market']
        }),
    })
})

export const {
    useGetMarketsQuery,
    useGetMarketByMarketIdQuery,
    useAddMarketMutation,
    useUpdateMarketMutation,
    useDeleteMarketMutation
} = marketService;

export const selectMarketResult = marketService.endpoints.getMarkets.select()
const selectMarketsData = createSelector(
    selectMarketResult,
    marketsResult => marketsResult.data
)

export const {
    selectAll: selectAllMarkets,
    selectById: selectMarketById,
    selectIds: selectMarketIds
} = marketsAdapter.getSelectors(state => selectMarketsData(state) ?? initialState);
