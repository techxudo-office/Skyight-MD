/** @format */

"use client";

import storage from "redux-persist/lib/storage";
import { combineReducers } from "@reduxjs/toolkit";
import authReducer from "../features/authSlice";
import userReducer from "../features/userSlice";
import roleReducer from "../features/roleSlice";
import ticketReducer from "../features/ticketSlice";
import bookingReducer from "../features/bookingSlice";
import transactionReducer from "../features/transactionSlice";
import notificationReducer from "../features/notificationSlice";
import settingReducer from "../features/settingSlice"
import companyReducer from "../features/companySlice"
import reasonsReducer from "../features/reasonsSlice"
import commisionReducer from "../features/commisionSlice"
import bankReducer from "../features/bankSlice"
import adminReducer from "../features/adminSlice"
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
  admin: adminReducer,
});

const rootReducer = (state, action) => {
  if (action.type === "user/logout") {
    storage.removeItem("persist:root");

    return appReducer(undefined, action);
  }
  return appReducer(state, action);
};
export default rootReducer;
