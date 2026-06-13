import { combineReducers } from "@reduxjs/toolkit";
import { persistReducer } from "redux-persist";
import storage from "redux-persist/lib/storage";

import locationReducer from "../features/locationSlice.js";

// Config for redux-persist
const persistConfig = {
  key: "root",
  storage,
  whitelist: ["location"], // only persist necessary slices
};

// Combine all feature reducers
const rootReducer = combineReducers({
  location: locationReducer,
});

export const persistedReducer = persistReducer(persistConfig, rootReducer);
