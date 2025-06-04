"use client";
import { configureStore } from "@reduxjs/toolkit";
import rootReducer from "../reducer/rootReducer"; // Import the combined reducer
import { PURGE, FLUSH, REHYDRATE, PAUSE, PERSIST, REGISTER } from "redux-persist";

const store = configureStore({
  reducer: rootReducer, // No global persist wrapper
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      immutableCheck: false,
      serializableCheck: false, // Still disable for redux-persist
      ignoredActions: [PURGE, FLUSH, REHYDRATE, PAUSE, PERSIST, REGISTER]
    }),
});

export { store };
