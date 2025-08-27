import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import makeRequest from "../../utils/ApiHelper";

const initialState = {
  credits: null,
  isLoadingCredits: false,
  creditsError: null,

  adminCredits: null,
  isLoadingAdminCredits: false,
  adminCreditsError: null,

  isEditingAdminCredits: false,

  flightBookings: [],
  isLoadingFlightBookings: false,
  flightBookingsError: null,

  latestBookings: [],
  isLoadingLatestBookings: false,
  latestBookingsError: null,

  bookingDetails: [],
  isLoadingBookingDetails: false,
  bookingDetailsError: null,

  companyBookings: [],
  isLoadingCompanyBookings: false,
  companyBookingsError: null,

  refundBookings: [],
  isGetRefundsLoading: false,
  getRefundBookingError: null,

  isRefundRequestLoading: false,
  refundBookingError: null,

  isCancelRequestLoading: false,
  cancelRequestError: null,
};

const bookingSlice = createSlice({
  name: "booking",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(getCredits.pending, (state) => {
        state.isLoadingCredits = true;
        state.creditsError = null;
      })
      .addCase(getCredits.fulfilled, (state, action) => {
        state.isLoadingCredits = false;
        state.credits = action.payload;
      })
      .addCase(getCredits.rejected, (state, action) => {
        state.isLoadingCredits = false;
        state.creditsError = action.payload;
      })
      .addCase(getAdminCredits.pending, (state) => {
        state.isLoadingAdminCredits = true;
        state.adminCreditsError = null;
      })
      .addCase(getAdminCredits.fulfilled, (state, action) => {
        state.isLoadingAdminCredits = false;
        state.adminCredits = action.payload;
      })
      .addCase(getAdminCredits.rejected, (state, action) => {
        state.isLoadingAdminCredits = false;
        state.adminCreditsError = action.payload;
      })
      .addCase(editAdminCredits.pending, (state) => {
        state.isEditingAdminCredits = true;
        state.adminCreditsError = null;
      })
      .addCase(editAdminCredits.fulfilled, (state, action) => {
        state.isEditingAdminCredits = false;
        state.adminCredits = action.payload;
      })
      .addCase(editAdminCredits.rejected, (state, action) => {
        state.isEditingAdminCredits = false;
        state.adminCreditsError = action.payload;
      })
      .addCase(getFlightBookings.pending, (state) => {
        state.isLoadingFlightBookings = true;
        state.flightBookingsError = null;
      })
      .addCase(getFlightBookings.fulfilled, (state, action) => {
        state.isLoadingFlightBookings = false;
        state.flightBookings = action.payload;
      })
      .addCase(getFlightBookings.rejected, (state, action) => {
        state.isLoadingFlightBookings = false;
        state.flightBookingsError = action.payload;
      })
      .addCase(getLatestBooking.pending, (state) => {
        state.isLoadingLatestBookings = true;
        state.latestBookingsError = null;
      })
      .addCase(getLatestBooking.fulfilled, (state, action) => {
        state.isLoadingLatestBookings = false;
        state.latestBookings = action.payload;
      })
      .addCase(getLatestBooking.rejected, (state, action) => {
        state.isLoadingLatestBookings = false;
        state.latestBookingsError = action.payload;
      })
      .addCase(getBookingDetails.pending, (state) => {
        state.isLoadingBookingDetails = true;
        state.bookingDetailsError = null;
      })
      .addCase(getBookingDetails.fulfilled, (state, action) => {
        state.isLoadingBookingDetails = false;
        state.bookingDetails = action.payload;
      })
      .addCase(getBookingDetails.rejected, (state, action) => {
        state.isLoadingBookingDetails = false;
        state.bookingDetailsError = action.payload;
      })
      .addCase(getCompanyBookings.pending, (state) => {
        state.isLoadingCompanyBookings = true;
        state.companyBookingsError = null;
      })
      .addCase(getCompanyBookings.fulfilled, (state, action) => {
        state.isLoadingCompanyBookings = false;
        state.companyBookings = action.payload[0];
      })
      .addCase(getCompanyBookings.rejected, (state, action) => {
        state.isLoadingCompanyBookings = false;
        state.companyBookingsError = action.payload;
      })
      .addCase(refundRequestTicket.pending, (state) => {
        state.isGetRefundsLoading = true;
        state.refundBookings = null;
        state.getRefundBookingError = null;
      })
      .addCase(refundRequestTicket.fulfilled, (state, action) => {
        state.isGetRefundsLoading = false;
        state.refundBookings = action.payload;
        state.getRefundBookingError = null;
      })
      .addCase(refundRequestTicket.rejected, (state, action) => {
        state.isGetRefundsLoading = false;
        state.refundBookings = null;
        state.getRefundBookingError = action.payload;
      })
      .addCase(refundRequestFlight.pending, (state) => {
        state.isRefundRequestLoading = true;
        state.refundRequestError = null;
      })
      .addCase(refundRequestFlight.fulfilled, (state, action) => {
        state.isRefundRequestLoading = false;
        state.refundBookings = state.refundBookings.filter(
          (row) => row.id !== action.payload
        );
      })
      .addCase(refundRequestFlight.rejected, (state, action) => {
        state.isRefundRequestLoading = false;
        state.refundRequestError = action.payload;
      })
      .addCase(cancelRequestFlight.pending, (state) => {
        state.isCancelRequestLoading = true;
        state.cancelRequestError = null;
      })
      .addCase(cancelRequestFlight.fulfilled, (state, action) => {
        state.isCancelRequestLoading = false;
        state.flightBookings = state.flightBookings.filter(
          (row) => row.id !== action.payload
        );
      })
      .addCase(cancelRequestFlight.rejected, (state, action) => {
        state.isCancelRequestLoading = false;
        state.cancelRequestError = action.payload;
      });
  },
});

export const getCredits = createAsyncThunk(
  "booking/getCredits",
  async (token, thunkAPI) => {
    try {
      const response = await makeRequest("GET", "/api/booking-credit", {
        token,
        headers: { "Content-Type": "application/json" },
        errorMessage: "Something went wrong. Please try again.",
      });
      return response;
    } catch (error) {
      return thunkAPI.rejectWithValue(error);
    }
  }
);

export const getAdminCredits = createAsyncThunk(
  "booking/getAdminCredits",
  async (token, thunkAPI) => {
    try {
      const response = await makeRequest("GET", "/api/get-credit", {
        token,
        headers: { "Content-Type": "application/json" },
        errorMessage: "Something went wrong. Please try again.",
      });
      return response
    } catch (error) {
      return thunkAPI.rejectWithValue(error);
    }
  }
);

export const editAdminCredits = createAsyncThunk(
  "booking/editAdminCredits",
  async ({ token, data }, thunkAPI) => {
    try {
      await makeRequest("PUT", "/api/update-credit", {
        data,
        token,
        errorMessage: "Failed while updating admin credits",
      });
    } catch (error) {
      return thunkAPI.rejectWithValue(error);
    }
  }
);

export const getFlightBookings = createAsyncThunk(
  "booking/getFlightBookings",
  async ({ token, logoutHandler }, thunkAPI) => {
    try {
      let response = await makeRequest("GET", "/api/booking", {
        token,
        errorMessage: "Failed to fetch flight bookings.",
        logoutCallback: logoutHandler,
      });
      if (!Array.isArray(response)) {
        response = [response];
      }

      if (response.length > 0) {
        return response;
      } else {
        throw new Error("No bookings found.");
      }
    } catch (error) {
      return thunkAPI.rejectWithValue(error);
    }
  }
);

export const getLatestBooking = createAsyncThunk(
  "booking/getLatestBooking",
  async ({ token, logoutHandler }, thunkAPI) => {
    try {
      const response = await makeRequest("GET", "/api/get-latest-bookings", {
        token,
        logoutCallback: logoutHandler,
        headers: { "Content-Type": "application/json" },
        errorMessage: "Failed to fetch booking details",
      });
      return response;
    } catch (error) {
      return thunkAPI.rejectWithValue(error);
    }
  }
);

export const getBookingDetails = createAsyncThunk(
  "booking/getBookingDetails",
  async ({ id, token }, thunkAPI) => {
    try {
      const response = await makeRequest("GET", `/api/booking/${id}`, {
        token,
        headers: { "Content-Type": "application/json" },
        errorMessage: "Failed to fetch booking details",
      });
      return response
    } catch (error) {
      return thunkAPI.rejectWithValue(error);
    }
  }
);

export const getCompanyBookings = createAsyncThunk(
  "booking/getCompanyBookings",
  async ({ id, token }, thunkAPI) => {
    try {
      const response = await makeRequest("GET", `/api/booking/company/${id}`, {
        token,
        headers: { "Content-Type": "application/json" },
        errorMessage: "Failed to fetch company bookings",
      });
      return response
    } catch (error) {
      return thunkAPI.rejectWithValue(error);
    }
  }
);

export const getRefundFlight = createAsyncThunk(
  "booking/getRefundFlight",
  async (token, thunkAPI) => {
    try {
      const response = await makeRequest("GET", "/api/refund-booking", {
        token,
        errorMessage: "Failed to fetch refund bookings",
      });
      return response
    } catch (error) {
      return thunkAPI.rejectWithValue(error);
    }
  }
);

export const refundRequestFlight = createAsyncThunk(
  "booking/refundRequestFlight",
  async ({ id, token }, thunkAPI) => {
    try {
      await makeRequest("POST", `/api/accept-request-refund-tickets/${id}`, {
        token,
        headers: { "Content-Type": "application/json" },
        successMessage: "Request refunded successfully",
        errorMessage: "Failed while refunding the flight request",
      });
      return id;
    } catch (error) {
      return thunkAPI.rejectWithValue(error);
    }
  }
);

export const refundRequestTicket = createAsyncThunk(
  "booking/getRefundTickets",
  async ({ token, logoutHandler }, thunkAPI) => {
    try {
      const response = await makeRequest("GET", "/api/request-refund-tickets", {
        token,
        logoutCallback: logoutHandler,
        errorMessage: "Failed to fetch request refund tickets",
      });

      if (response[0]?.length > 0) {
        return response[0];
      }
      return null;
    } catch (error) {
      return thunkAPI.rejectWithValue(error);
    }
  }
);

export const cancelRequestFlight = createAsyncThunk(
  "booking/cancelRequestFlight",
  async ({ id, token }, thunkAPI) => {
    try {
      await makeRequest("POST", `/api/accept-request-cancellation/${id}`, {
        token,
        headers: { "Content-Type": "application/json" },
        successMessage: "Cancel request successfully",
        errorMessage: "Failed while cancelling the flight request",
      });
      return id;
    } catch (error) {
      return thunkAPI.rejectWithValue(error);
    }
  }
);

export default bookingSlice.reducer;
