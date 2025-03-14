import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import axios from "axios";
import { BASE_URL } from "../../utils/ApiBaseUrl";
import toast from "react-hot-toast";

const initialState = {
  notifications: [],
  announcements: [],
  isLoadingNotifications: false,
  isLoadingAnnouncements: false,
  errorNotifications: null,
  errorAnnouncements: null,
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
      .addCase(getAnnouncements.pending, (state) => {
        state.isLoadingAnnouncements = true;
        state.errorAnnouncements = null;
      })
      .addCase(getAnnouncements.fulfilled, (state, action) => {
        state.isLoadingAnnouncements = false;
        state.announcements = action.payload;
      })
      .addCase(getAnnouncements.rejected, (state, action) => {
        state.isLoadingAnnouncements = false;
        state.errorAnnouncements = action.payload;
      });
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

export const getAnnouncements = createAsyncThunk(
  "notification/getAnnouncements",
  async (token, thunkAPI) => {
    try {
      const response = await axios.get(`${BASE_URL}/api/getAnnouncements`, {
        headers: {
          Authorization: token,
        },
      });

      if (response.status === 200) {
        return response.data;
      } else {
        throw new Error("Failed to fetch announcements");
      }
    } catch (error) {
      const errorMessage =
        error?.response?.data?.message ||
        "Failed to fetch announcements. Please try again.";
      toast.error(errorMessage);
      return thunkAPI.rejectWithValue(errorMessage);
    }
  }
);

export default notificationSlice.reducer;
