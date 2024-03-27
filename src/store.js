import { combineReducers, configureStore } from "@reduxjs/toolkit";
import { apiSlice } from "./services/apiSlice";
import { setupListeners } from "@reduxjs/toolkit/query";
import authSlice from "./services/authSlice";
import { persistStore, persistReducer } from 'redux-persist';
import storage from 'redux-persist/lib/storage';

const rootReducer = combineReducers({
    [apiSlice.reducerPath]: apiSlice.reducer,
    auth: authSlice
});

const persistConfig = {
    key: 'root',
    storage,
    whitelist: ['auth'],
};

const persistedReducer = persistReducer(persistConfig, rootReducer);

export const store = configureStore({
    reducer: persistedReducer,
    middleware: (getDefaultMiddleware) => getDefaultMiddleware({ serializableCheck: false }).concat(apiSlice.middleware),
    devTools: process.env.NODE_ENV !== 'production'
})

export const persistor = persistStore(store);
setupListeners(store.dispatch);