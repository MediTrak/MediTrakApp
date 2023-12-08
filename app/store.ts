import { Action, ThunkAction, configureStore } from '@reduxjs/toolkit';
import { setupListeners } from '@reduxjs/toolkit/query/react'
import { mediTrakApi } from './services/mediTrakApi';
import authSlice  from './services/authSlice';

export const store = configureStore({
  reducer: {
    [mediTrakApi.reducerPath]: mediTrakApi.reducer,
    auth: authSlice
  },
  middleware: (getDefaultMiddleware) =>
  getDefaultMiddleware().concat(mediTrakApi.middleware),
});

// Infer the `RootState` and `AppDispatch` types from the store itself
export type RootState = ReturnType<typeof store.getState>
export type AppDispatch = typeof store.dispatch

setupListeners(store.dispatch);