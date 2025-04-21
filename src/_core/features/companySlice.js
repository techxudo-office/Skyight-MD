import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import axios from "axios";
import { BASE_URL } from "../../utils/ApiBaseUrl";
import toast from "react-hot-toast";

const initialState = {
  companies: [],
  isLoadingCompanies: false,
  companiesError: null,

  companyTickets: [],
  isLoadingCompanyTickets: false,
  companyTicketsError: null,

  companyRevenue: "",
  isLoadingCompanyRevenue: false,
  companyRevenueError: null,
};

const companySlice = createSlice({
  name: "company",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(getCompanies.pending, (state) => {
        state.isLoadingCompanies = true;
      })
      .addCase(getCompanies.fulfilled, (state, action) => {
        state.companies = action.payload.data.companies;
        state.isLoadingCompanies = false;
      })
      .addCase(getCompanies.rejected, (state, action) => {
        state.isLoadingCompanies = false;
        state.companiesError = action.payload;
      })
      .addCase(getCompanyTickets.pending, (state) => {
        state.isLoadingCompanyTickets = true;
      })
      .addCase(getCompanyTickets.fulfilled, (state, action) => {
        state.companyTickets = action.payload[0];
        state.isLoadingCompanyTickets = false;
      })
      .addCase(getCompanyTickets.rejected, (state, action) => {
        state.isLoadingCompanyTickets = false;
        state.companyTicketsError = action.payload;
      })
      .addCase(getCompanyRevenue.pending, (state) => {
        state.isLoadingCompanyRevenue = true;
      })
      .addCase(getCompanyRevenue.fulfilled, (state, action) => {
        state.companyRevenue = action.payload;
        state.isLoadingCompanyRevenue = false;
      })
      .addCase(getCompanyRevenue.rejected, (state, action) => {
        state.isLoadingCompanyRevenue = false;
        state.companyRevenueError = action.payload;
      })
  },
});

export const getCompanies = createAsyncThunk(
  "company/getCompanies",
  async (token, thunkAPI) => {
    try {
      const response = await axios.get(
        `${BASE_URL}/api/allCompanies?page=0&limit=1000000000`,
        {
          headers: {
            Authorization: token,
          },
        }
      );

      return {
        data: response.data.data,
        totalPages: response.data.totalPages || 1,
      };
    } catch (error) {
      const errorMessage =
        error?.response?.data?.message || "Failed to fetch companies.";
      toast.error(errorMessage);
      return thunkAPI.rejectWithValue(errorMessage);
    }
  }
);

export const getCompanyTickets = createAsyncThunk(
  "company/getCompanyTickets",
  async ({ token, id }, thunkAPI) => {
    try {
      const response = await axios.get(
        `${BASE_URL}/api/allTicketsByCompany/${id}`,
        {
          headers: {
            Authorization: token,
          },
        }
      );

      return response.data.data;
    } catch (error) {
      const errorMessage =
        error?.response?.data?.message || "Failed to fetch companies.";
      toast.error(errorMessage);
      return thunkAPI.rejectWithValue(errorMessage);
    }
  }
);

export const getCompanyRevenue = createAsyncThunk(
  "company/getCompanyRevenue",
  async ({ token, id }, thunkAPI) => {
    try {
      const response = await axios.get(
        `${BASE_URL}/api/company/get-revenue/${id}`,
        {
          headers: {
            Authorization: token,
          },
        }
      );

      return response.data.data;
    } catch (error) {
      const errorMessage =
        error?.response?.data?.message || "Failed to fetch company revenue.";
      toast.error(errorMessage);
      return thunkAPI.rejectWithValue(errorMessage);
    }
  }
);

export const editRole = createAsyncThunk(
  "role/editRole",
  async ({ id, token, data }, thunkAPI) => {
    try {
      let response = await axios.put(`${BASE_URL}/api/role/${id}`, data, {
        headers: {
          Authorization: token,
        },
      });

      if (response.status === 200) {
        toast.success("Role updated successfully");
        return response.data.data;
      }
    } catch (error) {
      const errorMessage = "Failed while updating this role";
      toast.error(errorMessage);
      return thunkAPI.rejectWithValue(errorMessage);
    }
  }
);

export default companySlice.reducer;
