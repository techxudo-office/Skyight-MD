import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import makeRequest from "./ApiHelper";

const initialState = {
  notifications: [],
  isLoadingNotifications: false,
  errorNotifications: null,

  isCreatingNotification: false,
  createNotificationError: null,
};

const notificationSlice = createSlice({
  name: "notification",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(getNotifications.pending, (state) => {
        state.isLoadingNotifications = true;
        state.errorNotifications = null;
      })
      .addCase(getNotifications.fulfilled, (state, action) => {
        state.isLoadingNotifications = false;
        state.notifications = action.payload;
      })
      .addCase(getNotifications.rejected, (state, action) => {
        state.isLoadingNotifications = false;
        state.errorNotifications = action.payload;
      })
      .addCase(createNotification.pending, (state) => {
        state.isCreatingNotification = true;
        state.createNotificationError = null;
      })
      .addCase(createNotification.fulfilled, (state, action) => {
        state.isCreatingNotification = false;
      })
      .addCase(createNotification.rejected, (state, action) => {
        state.isCreatingNotification = false;
        state.createNotificationError = action.payload;
      });
  },
});

export const getNotifications = createAsyncThunk(
  "notification/getNotifications",
  async ({ token, id }, { rejectWithValue }) => {
    try {
      const response = await makeRequest('get', `/api/notification/${id}`, {
        token,
        errorMessage: "Failed to fetch notifications"
      });
      return response.data.data;
    } catch (error) {
      return rejectWithValue(error);
    }
  }
);

export const createNotification = createAsyncThunk(
  "notification/createNotification",
  async ({ data, token }, { rejectWithValue }) => {
    try {
      const response = await makeRequest('post', '/api/SendNotificationToCompany', {
        data,
        token,
        headers: { 'Content-Type': 'application/json' },
        successMessage: "Notification sent successfully",
        errorMessage: "Failed to send notification"
      });
      return response.data.data;
    } catch (error) {
      return rejectWithValue(error);
    }
  }
);

export default notificationSlice.reducer;
