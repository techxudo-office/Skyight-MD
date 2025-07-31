/** @format */

"use client";

import storage from "redux-persist/lib/storage";
import { combineReducers } from "@reduxjs/toolkit";
import persistReducer from "redux-persist/es/persistReducer";

// Importing feature-specific reducers
import authReducer from "../features/authSlice";
import userReducer from "../features/userSlice";
import roleReducer from "../features/roleSlice";
import ticketReducer from "../features/ticketSlice";
import bookingReducer from "../features/bookingSlice";
import transactionReducer from "../features/transactionSlice";
import notificationReducer from "../features/notificationSlice";
import settingReducer from "../features/settingSlice";
import companyReducer from "../features/companySlice";
import reasonsReducer from "../features/reasonsSlice";
import commisionReducer from "../features/commisionSlice";
import bankReducer from "../features/bankSlice";
import offerReducer from "../features/offersSlice";
import adminReducer from "../features/adminSlice";
import persistedReducer from "../features/persistSlice";

// Combine all feature reducers into a single reducer
const appReducer = combineReducers({
  auth: authReducer,
  user: userReducer,
  role: roleReducer,
  ticket: ticketReducer,
  booking: bookingReducer,
  transaction: transactionReducer,
  notification: notificationReducer,
  setting: settingReducer,
  company: companyReducer,
  reasons: reasonsReducer,
  commision: commisionReducer,
  bank: bankReducer,
  offer: offerReducer,
  admin: adminReducer,
  persist: persistedReducer, // This slice is the only one persisted
});

// Root reducer with optional global reset behavior
const rootReducer = (state, action) => {
  // If logout is dispatched, clear persisted data from storage
  if (action.type === "user/logout") {
    storage.removeItem("persist:root");

    // Reset state to undefined, effectively clearing all reducers
    return appReducer(undefined, action);
  }

  // Otherwise, proceed normally
  return appReducer(state, action);
};

// Wrap the root reducer with persistence configuration
const persistedReducers = persistReducer(
  {
    key: "root", // Key for persisted root object
    storage,     // Use localStorage via redux-persist
    whitelist: ["persist"], // Only persist the "persist" slice
  },
  rootReducer
);

// Export persisted root reducer for use in store configuration
export default persistedReducers;
