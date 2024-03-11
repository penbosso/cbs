import { configureStore} from "@reduxjs/toolkit";
import { apiSlice } from "./services/apiSlice";
import { setupListeners } from "@reduxjs/toolkit/query";
import authSlice from "./services/authSlice";

export const store = configureStore({
    reducer: {
        [apiSlice.reducerPath]: apiSlice.reducer,
        auth: authSlice
    },
    middleware: (getDefaultMiddleware) => getDefaultMiddleware({serializableCheck: false}).concat(apiSlice.middleware),
    devTools: process.env.NODE_ENV !== 'production'
})

setupListeners(store.dispatch);