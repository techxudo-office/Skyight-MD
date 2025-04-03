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
      .addCase(createRole.pending, (state) => {
        state.isLoadingCreateRole = true;
      })
      .addCase(createRole.fulfilled, (state, action) => {
        state.isLoadingCreateRole = false;
        state.roles = [action.payload, ...state.roles];
      })
      .addCase(createRole.rejected, (state, action) => {
        state.isLoadingCreateRole = false;
        state.rolesError = action.payload;
      });
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

export const createRole = createAsyncThunk(
  "role/createRole",
  async ({ data, token }, thunkAPI) => {
    try {
      const response = await axios.post(`${BASE_URL}/api/role`, data, {
        headers: {
          Authorization: token,
          "Content-Type": "application/json",
        },
      });
      toast.success("Role created successfully");
      return response.data;
    } catch (error) {
      const errorMessage =
        error?.response?.data?.message || "Failed to create role.";
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
