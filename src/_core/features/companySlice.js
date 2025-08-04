import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import makeRequest from "../../utils/ApiHelper";

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
        state.companies = action.payload;
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
      });
  },
});

export const getCompanies = createAsyncThunk(
  "company/getCompanies",
  async ({ token, logoutHandler }) => {
    const response = await makeRequest(
      "GET",
      "/api/allCompanies?page=0&limit=1000000000",
      {
        token,
        logoutCallback: logoutHandler,
        errorMessage: "Failed to fetch companies.",
      }
    );
    return response.companies;
  }
);

export const getCompanyTickets = createAsyncThunk(
  "company/getCompanyTickets",
  async ({ token, id }) => {
    const response = await makeRequest(
      "GET",
      `/api/allTicketsByCompany/${id}`,
      {
        token,
        errorMessage: "Failed to fetch company tickets.",
      }
    );
    return response
  }
);

export const getCompanyRevenue = createAsyncThunk(
  "company/getCompanyRevenue",
  async ({ token, id }) => {
    const response = await makeRequest(
      "GET",
      `/api/company/get-revenue/${id}`,
      {
        token,
        errorMessage: "Failed to fetch company revenue.",
      }
    );
    return response
  }
);

export const editRole = createAsyncThunk(
  "role/editRole",
  async ({ id, token, data }) => {
    const response = await makeRequest("PUT", `/api/role/${id}`, {
      data,
      token,
      successMessage: "Role updated successfully",
      errorMessage: "Failed while updating this role",
    });
    return response
  }
);

export default companySlice.reducer;
