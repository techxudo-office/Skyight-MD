import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import axios from "axios";
import { BASE_URL } from "../../utils/ApiBaseUrl";
import toast from "react-hot-toast";

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
        state.isCreatingbank = true;
        state.createNotificationError = null;
      })
      .addCase(createNotification.fulfilled, (state, action) => {
        state.isCreatingbank = false;
        state.banks.push(action.payload);
      })
      .addCase(createNotification.rejected, (state, action) => {
        state.isCreatingbank = false;
        state.createNotificationError = action.payload;
      })
  },
});

export const getNotifications = createAsyncThunk(
  "notification/getNotifications",
  async (token, thunkAPI) => {
    try {
      const response = await axios.get(
        `${BASE_URL}/api/notification?isMaster=${true}`,
        {
          headers: {
            Authorization: token,
          },
        }
      );

      if (response.status === 200) {
        return response.data;
      } else {
        throw new Error("Failed to fetch notifications");
      }
    } catch (error) {
      const errorMessage =
        error.response?.data?.message ||
        "Failed to fetch notifications. Please try again.";
      toast.error(errorMessage);
      return thunkAPI.rejectWithValue(errorMessage);
    }
  }
);

export const createNotification = createAsyncThunk(
  "notification/createNotification",
  async ({ data, token }, thunkAPI) => {
    try {
      const response = await axios.post(`${BASE_URL}/api/SendNotificationToCompany`, data, {
        headers: {
          Authorization: token,
          "Content-Type": "application/json",
        },
      });
      toast.success("Notification sent successfully");
      return response.data.data;
    } catch (error) {
      console.log(error);
      const errorMessage =
        error.response?.data?.message || "Failed to sent notification.";
      toast.error(errorMessage);
      return thunkAPI.rejectWithValue(errorMessage);
    }
  }
);

export default notificationSlice.reducer;
