/** @format */

"use client";
import { configureStore } from "@reduxjs/toolkit";
import { persistReducer } from "redux-persist";
import rootReducer from "../reducer/rootReducer";
import storage from "redux-persist/lib/storage";
const persistConfig = {
  key: "root",
  version: 1,
  storage: storage,
};

const persistedReducer = persistReducer(persistConfig, rootReducer);

const store = configureStore({
  reducer: persistedReducer,
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      immutableCheck: false,
      serializableCheck: false,
    }),
});

export { store };
