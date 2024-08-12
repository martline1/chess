import { combineReducers } from '@reduxjs/toolkit';

import { createStore } from "@helpers/createStore";
import { ChessSlice } from './Slices/ChessSlice';

export const {
  store,
  useAppSelector,
  useAppDispatch,
} = createStore(null, combineReducers({
  // Slices
  ChessSlice : ChessSlice.reducer,
}));

export type RootState = ReturnType<typeof store.getState>;
