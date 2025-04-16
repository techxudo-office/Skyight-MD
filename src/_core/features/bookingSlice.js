import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import axios from "axios";
import { BASE_URL } from "../../utils/ApiBaseUrl";
import toast from "react-hot-toast";

const initialState = {
  travelers: [],
  isLoadingTravelers: false,
  travelersError: null,

  pnrData: null,
  isLoadingPNR: false,
  pnrError: null,

  credits: null,
  isLoadingCredits: false,
  creditsError: null,

  flightBookings: [],
  isLoadingFlightBookings: false,
  flightBookingsError: null,

  bookingDetails: [],
  isLoadingBookingDetails: false,
  bookingDetailsError: null,

  companyBookings: [],
  isLoadingCompanyBookings: false,
  companyBookingsError: null,

  isIssuingBooking: false,
  issueBookingError: null,

  searchResults: [],
  isLoadingSearchResults: false,
  searchResultsError: null,

  routes: [],
  loadingRoutes: false,
  routesError: null,

  isBookingLoading: false,
  bookingMessage: null,
  bookingError: null,

  isRefundLoading: false,
  refundMessage: null,
  refundError: null,

  isCancelling: false,
  cancelSuccess: null,
  cancelError: null,

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
      .addCase(getTravelers.pending, (state) => {
        state.isLoadingTravelers = true;
        state.travelersError = null;
      })
      .addCase(getTravelers.fulfilled, (state, action) => {
        state.isLoadingTravelers = false;
        state.travelers = action.payload;
      })
      .addCase(getTravelers.rejected, (state, action) => {
        state.isLoadingTravelers = false;
        state.travelersError = action.payload;
      })
      .addCase(getPNR.pending, (state) => {
        state.isLoadingPNR = true;
        state.pnrError = null;
      })
      .addCase(getPNR.fulfilled, (state, action) => {
        state.isLoadingPNR = false;
        state.pnrData = action.payload;
      })
      .addCase(getPNR.rejected, (state, action) => {
        state.isLoadingPNR = false;
        state.pnrError = action.payload;
      })
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
      .addCase(issueBooking.pending, (state) => {
        state.isIssuingBooking = true;
        state.issueBookingError = null;
      })
      .addCase(issueBooking.fulfilled, (state, action) => {
        state.isIssuingBooking = false;
      })
      .addCase(issueBooking.rejected, (state, action) => {
        state.isIssuingBooking = false;
        state.issueBookingError = action.payload;
      })
      .addCase(searchFlight.pending, (state) => {
        state.isLoadingSearchResults = true;
        state.searchResultsError = null;
      })
      .addCase(searchFlight.fulfilled, (state, action) => {
        state.isLoadingSearchResults = false;
        state.searchResults = action.payload;
      })
      .addCase(searchFlight.rejected, (state, action) => {
        state.isLoadingSearchResults = false;
        state.searchResultsError = action.payload;
      })
      .addCase(getRoutes.pending, (state) => {
        state.loadingRoutes = true;
        state.routesError = null;
      })
      .addCase(getRoutes.fulfilled, (state, action) => {
        state.loadingRoutes = false;
        state.routes = action.payload;
      })
      .addCase(getRoutes.rejected, (state, action) => {
        state.loadingRoutes = false;
        state.routesError = action.payload;
      })
      .addCase(confirmBooking.pending, (state) => {
        state.isBookingLoading = true;
      })
      .addCase(confirmBooking.fulfilled, (state, action) => {
        state.isBookingLoading = false;
        state.bookingMessage = action.payload.message;
      })
      .addCase(confirmBooking.rejected, (state, action) => {
        state.isBookingLoading = false;
        state.bookingError = action.payload;
      })
      .addCase(requestRefund.pending, (state) => {
        state.isRefundLoading = true;
      })
      .addCase(requestRefund.fulfilled, (state, action) => {
        state.isRefundLoading = false;
        state.refundMessage = action.payload.message;
      })
      .addCase(requestRefund.rejected, (state, action) => {
        state.isRefundLoading = false;
        state.refundError = action.payload;
      })
      .addCase(getRefundFlight.pending, (state) => {
        state.isGetRefundsLoading = true;
        state.refundBookings = null;
        state.getRefundBookingError = null;
      })
      .addCase(getRefundFlight.fulfilled, (state, action) => {
        state.isGetRefundsLoading = false;
        state.refundBookings = action.payload;
        state.getRefundBookingError = null;
      })
      .addCase(getRefundFlight.rejected, (state, action) => {
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

export const getTravelers = createAsyncThunk(
  "booking/getTravelers",
  async ({ passengerType, token }, thunkAPI) => {
    try {
      const response = await axios.get(
        `${BASE_URL}/api/getTravellers?passenger_type=${passengerType}`,
        {
          headers: {
            Authorization: token,
          },
        }
      );
      if (response.status === 200) {
        return response.data.data;
      } else {
        throw new Error("Failed to fetch travelers");
      }
    } catch (error) {
      const errorMessage =
        error?.response?.data?.message || "Failed to fetch travelers";
      toast.error(errorMessage);
      return thunkAPI.rejectWithValue(errorMessage);
    }
  }
);

export const getPNR = createAsyncThunk(
  "booking/getPNR",
  async ({ id, token }, thunkAPI) => {
    try {
      const response = await axios.post(
        `${BASE_URL}/api/booking-pnr`,
        { pnr: id },
        {
          headers: {
            Authorization: token,
            "Content-Type": "application/json",
          },
        }
      );

      if (response.status === 200) {
        return response.data.data;
      } else {
        const errorMessages = Object.values(response.data.data.errors).join(
          ", "
        );
        throw new Error(errorMessages);
      }
    } catch (error) {
      const errorMessage =
        Object.values(error?.response?.data?.data?.errors || {}).join(", ") ||
        "Failed to fetch PNR";
      toast.error(errorMessage);
      return thunkAPI.rejectWithValue(errorMessage);
    }
  }
);

export const getCredits = createAsyncThunk(
  "booking/getCredits",
  async (token, thunkAPI) => {
    try {
      const response = await axios({
        method: "GET",
        url: `${BASE_URL}/api/booking-credit`,
        headers: {
          Authorization: token,
          "Content-Type": "application/json",
        },
      });
      return response.data.data;
    } catch (error) {
      const errorMessage =
        error?.response?.data?.message ||
        "Something went wrong. Please try again.";
      toast.error(errorMessage);
      return thunkAPI.rejectWithValue(errorMessage);
    }
  }
);

export const getFlightBookings = createAsyncThunk(
  "booking/getFlightBookings",
  async (token, thunkAPI) => {
    try {
      const response = await axios.get(`${BASE_URL}/api/booking`, {
        headers: {
          Authorization: token,
        },
      });

      if (response.data.status === "success") {
        let responseData = response.data.data;
        if (!Array.isArray(responseData)) {
          responseData = [responseData];
        }

        if (responseData.length > 0) {
          return responseData;
        } else {
          throw new Error("No bookings found.");
        }
      }
    } catch (error) {
      const errorMessage =
        error?.response?.data?.message || "Failed to fetch flight bookings.";
      return thunkAPI.rejectWithValue(errorMessage);
    }
  }
);

export const getBookingDetails = createAsyncThunk(
  "booking/getBookingDetails",
  async ({ id, token }, thunkAPI) => {
    try {
      const response = await axios.get(`${BASE_URL}/api/booking/${id}`, {
        headers: {
          "Content-Type": "application/json",
          Authorization: token,
        },
      });
      if (response.status === 200) {
        return response.data.data;
      }
    } catch (error) {
      const errorMessage =
        error?.response?.data?.message || "Failed to fetch booking details";
      return thunkAPI.rejectWithValue(errorMessage);
    }
  }
);

export const getCompanyBookings = createAsyncThunk(
  "booking/getCompanyBookings",
  async ({ id, token }, thunkAPI) => {
    try {
      const response = await axios.get(
        `${BASE_URL}/api/booking/company/${id}`,
        {
          headers: {
            "Content-Type": "application/json",
            Authorization: token,
          },
        }
      );
      if (response.status === 200) {
        return response.data.data;
      }
    } catch (error) {
      const errorMessage =
        error?.response?.data?.message || "Failed to fetch booking details";
      return thunkAPI.rejectWithValue(errorMessage);
    }
  }
);

export const issueBooking = createAsyncThunk(
  "booking/issueBooking",
  async ({ pnr, token }, thunkAPI) => {
    try {
      const response = await axios.post(
        `${BASE_URL}/api/booking-issue`,
        { pnr },
        {
          headers: {
            Authorization: token,
          },
        }
      );

      if (response.status === 200) {
        toast.success("Booking issued successfully");
        return response.data.data;
      } else {
        throw new Error(response.data.message || "Failed to issue booking");
      }
    } catch (error) {
      const errorMessage =
        error?.response?.data?.message || "Failed to issue booking";
      toast.error(errorMessage);
      return thunkAPI.rejectWithValue(errorMessage);
    }
  }
);

export const searchFlight = createAsyncThunk(
  "booking/searchFlight",
  async ({ payload, token }, thunkAPI) => {
    try {
      const apiUrl = `${BASE_URL}/api/search`;

      const requestBody = {
        trip_type: payload.tripType,
        origin_destinations: [
          {
            departure_date_time: payload.departureDate,
            origin_location_code: payload.originCode,
            destination_location_code: payload.destinationCode,
          },
        ],
        adult_quantity: payload.adult,
        child_quantity: payload.child,
        infant_quantity: payload.infant,
      };

      // Handle round trip
      if (payload.tripType === "Return" && payload.returnDate) {
        requestBody.origin_destinations.push({
          departure_date_time: payload.returnDate,
          origin_location_code: payload.destinationCode,
          destination_location_code: payload.originCode,
        });
      }

      const response = await axios.post(apiUrl, requestBody, {
        headers: {
          "Content-Type": "application/json",
          Authorization: token,
        },
      });

      if (response.status === 200) {
        if (!response.data.data || response.data.data.length === 0) {
          throw new Error("No Flight Found!");
        }
        return response.data.data;
      } else {
        throw new Error(response.data.message || "Failed to search Flights");
      }
    } catch (error) {
      const errorMessage =
        error?.response?.data?.message || "Failed to search Flights";
      return thunkAPI.rejectWithValue(errorMessage);
    }
  }
);

export const getRoutes = createAsyncThunk(
  "flight/getRoutes",
  async (token, thunkAPI) => {
    try {
      const response = await axios.post(
        `${BASE_URL}/api/booking-all-active-routes`,
        {},
        {
          headers: {
            Authorization: token,
          },
        }
      );

      if (response.status === 200) {
        return response.data.data.Routes || [];
      }
    } catch (error) {
      const errorMessage =
        error?.response?.data?.message ||
        "Failed to fetch routes. Please try again.";
      return thunkAPI.rejectWithValue(errorMessage);
    }
  }
);

export const confirmBooking = createAsyncThunk(
  "booking/confirmBooking",
  async ({ data, token }, thunkAPI) => {
    try {
      let response = await axios({
        method: "POST",
        url: `${BASE_URL}/api/booking`,
        data: data,
        headers: {
          Authorization: token,
          "Content-Type": "application/json",
        },
      });

      if (response.status === 200) {
        toast.success("Booking created successfully");
        return { status: true, message: "Booking Created" };
      } else {
        return thunkAPI.rejectWithValue(
          response.data?.message || "Unexpected response"
        );
      }
    } catch (error) {
      const errorMessage = error.response?.data?.message || "An error occurred";
      toast.error(errorMessage);
      return thunkAPI.rejectWithValue(errorMessage);
    }
  }
);

export const requestRefund = createAsyncThunk(
  "booking/requestRefund",
  async ({ data, token }, thunkAPI) => {
    try {
      let response = await axios({
        method: "POST",
        url: `${BASE_URL}/api/request-booking-refund`,
        data: data,
        headers: {
          Authorization: token,
        },
      });

      if (response.status === 200) {
        toast.success("Requested refund successfully");
        return { status: true, message: "Refund Requested" };
      } else {
        return thunkAPI.rejectWithValue(
          response.data?.message || "Unexpected response"
        );
      }
    } catch (error) {
      const errorMessage = error.response?.data?.message || "An error occurred";
      toast.error(errorMessage);
      return thunkAPI.rejectWithValue(errorMessage);
    }
  }
);

export const getRefundFlight = createAsyncThunk(
  "booking/getRefundFlight",
  async (token, thunkAPI) => {
    try {
      const response = await axios.get(`${BASE_URL}/api/refund-booking`, {
        headers: {
          Authorization: token,
        },
      });

      return response.data.data;
    } catch (error) {
      const errorMessage =
        error?.response?.data?.message || "Failed to fetch refund bookings";
      return thunkAPI.rejectWithValue(errorMessage);
    }
  }
);

export const refundRequestFlight = createAsyncThunk(
  "booking/refundRequestFlight",
  async ({ id, token }, thunkAPI) => {
    try {
      const response = await axios.post(
        `${BASE_URL}/api/accept-request-refund/${id}`,
        {},
        {
          headers: {
            Authorization: token,
            "Content-Type": "application/json",
          },
        }
      );

      if (response.status === 200) {
        toast.success("Request refunded successfully");
        return id;
      }
    } catch (error) {
      const errorMessage = "Failed while refunding the flight request";
      toast.error(errorMessage);
      return thunkAPI.rejectWithValue(errorMessage);
    }
  }
);

export const cancelRequestFlight = createAsyncThunk(
  "booking/cancelRequestFlight",
  async ({ id, token }, thunkAPI) => {
    try {
      const response = await axios.post(
        `${BASE_URL}/api/accept-request-cancellation/${id}`,
        {},
        {
          headers: {
            Authorization: token,
            "Content-Type": "application/json",
          },
        }
      );

      if (response.status === 200) {
        toast.success("Cancel request successfully");
        return id;
      }
    } catch (error) {
      const errorMessage = "Failed while cancelling the flight request";
      toast.error(errorMessage);
      return thunkAPI.rejectWithValue(errorMessage);
    }
  }
);

export default bookingSlice.reducer;
