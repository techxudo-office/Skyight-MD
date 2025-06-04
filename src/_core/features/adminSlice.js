import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import makeRequest from "../../utils/ApiHelper";

const initialState = {
  admins: [],
  isLoadingAdmins: false,
  adminsError: null,

  dashboard: [],
  isLoadingDashboard: false,
  dashboardError: null,

  isCreatingAdmin: false,
  createAdminError: null,

  isDeletingAdmin: false,
  deleteAdminError: null,

  isEditingAdmin: false,
  editAdminError: null,
};

const adminSlice = createSlice({
  name: "admin",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(getAdmins.pending, (state) => {
        state.isLoadingAdmins = true;
        state.adminsError = null;
      })
      .addCase(getAdmins.fulfilled, (state, action) => {
        state.isLoadingAdmins = false;
        state.admins = action.payload;
      })
      .addCase(getAdmins.rejected, (state, action) => {
        state.isLoadingAdmins = false;
        state.adminsError = action.payload;
      })
      .addCase(getDashboardAnalytics.pending, (state) => {
        state.isLoadingDashboard = true;
        state.dashboardError = null;
      })
      .addCase(getDashboardAnalytics.fulfilled, (state, action) => {
        state.isLoadingDashboard = false;
        state.dashboard = action.payload;
      })
      .addCase(getDashboardAnalytics.rejected, (state, action) => {
        state.isLoadingDashboard = false;
        state.dashboardError = action.payload;
      })
      .addCase(createAdmin.pending, (state) => {
        state.isCreatingAdmin = true;
        state.createAdminError = null;
      })
      .addCase(createAdmin.fulfilled, (state, action) => {
        state.isCreatingAdmin = false;
        state.admins.push(action.payload);
      })
      .addCase(createAdmin.rejected, (state, action) => {
        state.isCreatingAdmin = false;
        state.createAdminError = action.payload;
      })
      .addCase(deleteAdmin.pending, (state) => {
        state.isDeletingAdmin = true;
        state.deleteAdminError = null;
      })
      .addCase(deleteAdmin.fulfilled, (state, action) => {
        state.isDeletingAdmin = false;
        state.admins = state.admins.filter(
          (admin) => admin.id !== action.payload
        );
      })
      .addCase(deleteAdmin.rejected, (state, action) => {
        state.isDeletingAdmin = false;
        state.deleteAdminError = action.payload;
      })
      .addCase(editAdmin.pending, (state) => {
        state.isEditingAdmin = true;
        state.editAdminError = null;
      })
      .addCase(editAdmin.fulfilled, (state, action) => {
        state.isEditingAdmin = false;
        const updatedAdmin = action.payload;
        state.admins = state.admins.map((user) =>
          user.id === updatedAdmin.id ? { ...user, ...updatedAdmin } : user
        );
      })
      .addCase(editAdmin.rejected, (state, action) => {
        state.isEditingAdmin = false;
        state.editAdminError = action.payload;
      });
  },
});

export const getAdmins = createAsyncThunk(
  "admin/getAdmins",
  async ({ token, logoutHandler }, thunkAPI) => {
    const response = await makeRequest("GET", "/api/admin", {
      token,
      logoutCallback: logoutHandler,
      errorMessage: "Failed to fetch admins.",
    });
    return response?.data?.data.admins || response;
  }
);

export const getDashboardAnalytics = createAsyncThunk(
  "admin/getDashboardAnalytics",
  async (token, thunkAPI) => {
    const response = await makeRequest("GET", "/api/adminKpi", {
      token,
      errorMessage: "Failed to fetch analytics.",
    });
    return response?.data.data;
  }
);

export const createAdmin = createAsyncThunk(
  "admin/createAdmin",
  async ({ data, token }, thunkAPI) => {
    const response = await makeRequest("POST", "/api/admin", {
      data,
      token,
      successMessage: "Admin created successfully",
      errorMessage: "Failed to create admin.",
      headers: { "Content-Type": "application/json" },
    });
    return response;
  }
);

export const deleteAdmin = createAsyncThunk(
  "admin/deleteAdmin",
  async ({ id, token }, thunkAPI) => {
    await makeRequest("DELETE", `/api/admin/${id}`, {
      token,
      successMessage: "Admin deleted successfully",
      errorMessage: "Failed while deleting this admin",
    });
    return id;
  }
);

export const editAdmin = createAsyncThunk(
  "admin/editAdmin",
  async ({ id, token, data }, thunkAPI) => {
    const response = await makeRequest("PUT", `/api/admin/${id}`, {
      data,
      token,
      successMessage: "Admin updated successfully",
      errorMessage: "Failed while updating this admin",
    });
    return response?.data.data || response;
  }
);

export default adminSlice.reducer;
