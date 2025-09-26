import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import makeRequest from "../../utils/ApiHelper";

// Initial state includes loading and error states for various admin operations
const initialState = {
  admins: [],
  isLoadingAdmins: false,
  adminsError: null,

  dashboard: [],
  isLoadingDashboard: false,

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
      // Get Admins
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

      // Get Dashboard Analytics
      .addCase(getDashboardAnalytics.pending, (state) => {
        state.isLoadingDashboard = true;
      })
      .addCase(getDashboardAnalytics.fulfilled, (state, action) => {
        state.isLoadingDashboard = false;
        state.dashboard = action.payload;
      })
      .addCase(getDashboardAnalytics.rejected, (state, action) => {
        state.isLoadingDashboard = false;
      })

      // Create Admin
      .addCase(createAdmin.pending, (state) => {
        state.isCreatingAdmin = true;
        state.createAdminError = null;
      })
      .addCase(createAdmin.fulfilled, (state, action) => {
        state.isCreatingAdmin = false;
        state.admins.push(action.payload); // Append the newly created admin to list
      })
      .addCase(createAdmin.rejected, (state, action) => {
        state.isCreatingAdmin = false;
        state.createAdminError = action.payload;
      })

      // Delete Admin
      .addCase(deleteAdmin.pending, (state) => {
        state.isDeletingAdmin = true;
        state.deleteAdminError = null;
      })
      .addCase(deleteAdmin.fulfilled, (state, action) => {
        state.isDeletingAdmin = false;
        // Remove the deleted admin from the list using the returned id
        state.admins = state.admins.filter(
          (admin) => admin.id !== action.payload
        );
      })
      .addCase(deleteAdmin.rejected, (state, action) => {
        state.isDeletingAdmin = false;
        state.deleteAdminError = action.payload;
      })

      // Edit Admin
      .addCase(editAdmin.pending, (state) => {
        state.isEditingAdmin = true;
        state.editAdminError = null;
      })
      .addCase(editAdmin.fulfilled, (state, action) => {
        state.isEditingAdmin = false;
        const updatedAdmin = action.payload;
        // Replace only the edited admin's data in the list
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

// Thunk to fetch list of admins with logout fallback on auth failure
export const getAdmins = createAsyncThunk(
  "admin/getAdmins",
  async ({ token, logoutHandler }) => {
    const response = await makeRequest("GET", "/api/admin", {
      token,
      logoutCallback: logoutHandler, // triggers logout if token is expired/unauthorized
      errorMessage: "Failed to fetch admins.",
    });
    return response?.admins || response; // Return cleaned-up list of admins
  }
);

// Thunk to fetch dashboard stats for the admin panel
export const getDashboardAnalytics = createAsyncThunk(
  "admin/getDashboardAnalytics",
  ({ token, fromDate, toDate }) =>
    makeRequest(
      "GET",
      `/api/adminKpi?fromDate=${fromDate}&toDate=${toDate}`,
      { token, errorMessage: "Failed to fetch analytics." }
    )
);


// Thunk to create a new admin account
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

// Thunk to delete a specific admin by ID
export const deleteAdmin = createAsyncThunk(
  "admin/deleteAdmin",
  async ({ id, token }, thunkAPI) => {
    await makeRequest("DELETE", `/api/admin/${id}`, {
      token,
      successMessage: "Admin deleted successfully",
      errorMessage: "Failed while deleting this admin",
    });
    return id; // Only return ID so reducer can filter out that admin
  }
);

// Thunk to update an admin's information
export const editAdmin = createAsyncThunk(
  "admin/editAdmin",
  ({ id, token, data }, thunkAPI) =>
    makeRequest("PUT", `/api/admin/${id}`, {
      data,
      token,
      successMessage: "Admin updated successfully",
      errorMessage: "Failed while updating this admin",
    })
);

export default adminSlice.reducer;