import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import axios from "axios";
import { BASE_URL } from "../../utils/ApiBaseUrl";
import toast from "react-hot-toast";

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
  async (token, thunkAPI) => {
    try {
      const response = await axios.get(`${BASE_URL}/api/admin`, {
        headers: {
          Authorization: token,
        },
      });
      return response?.data?.data?.admins;
    } catch (error) {
      const errorMessage =
        error.response?.data?.message || "Failed to fetch admins.";
      toast.error(errorMessage);
      return thunkAPI.rejectWithValue(errorMessage);
    }
  }
);

export const getDashboardAnalytics = createAsyncThunk(
  "admin/getDashboardAnalytics",
  async (token, thunkAPI) => {
    try {
      const response = await axios.get(`${BASE_URL}/api/adminKpi`, {
        headers: {
          Authorization: token,
        },
      });
      return response?.data?.data;
    } catch (error) {
      const errorMessage =
        error.response?.data?.message || "Failed to fetch analytics.";
      toast.error(errorMessage);
      return thunkAPI.rejectWithValue(errorMessage);
    }
  }
);

export const createAdmin = createAsyncThunk(
  "admin/createAdmin",
  async ({ data, token }, thunkAPI) => {
    try {
      const response = await axios.post(`${BASE_URL}/api/admin`, data, {
        headers: {
          Authorization: token,
          "Content-Type": "application/json",
        },
      });
      toast.success("Admin created successfully");
      return response.data;
    } catch (error) {

      const errorMessage =
        error.response?.data?.message || "Failed to create admin.";
      toast.error(errorMessage);
      return thunkAPI.rejectWithValue(errorMessage);
    }
  }
);

export const deleteAdmin = createAsyncThunk(
  "admin/deleteAdmin",
  async ({ id, token }, thunkAPI) => {
    try {
      const response = await axios.delete(`${BASE_URL}/api/admin/${id}`, {
        headers: {
          Authorization: token,
        },
      });

      if (response.status === 200) {
        toast.success("Admin deleted successfully");
        return id;
      }
    } catch (error) {
      const errorMessage = "Failed while deleting this admin";
      toast.error(errorMessage);
      return thunkAPI.rejectWithValue(errorMessage);
    }
  }
);

export const editAdmin = createAsyncThunk(
  "admin/editAdmin",
  async ({ id, token, data }, thunkAPI) => {
    try {

      const response = await axios.put(`${BASE_URL}/api/admin/${id}`, data, {
        headers: {
          Authorization: token,
        },
      });

      if (response.status === 200) {
        toast.success("Admin updated successfully");
        return response.data.data;
      }
    } catch (error) {
      const errorMessage =
        error?.response?.data?.message || "Failed while updating this admin";
      toast.error(errorMessage);
      return thunkAPI.rejectWithValue(errorMessage);
    }
  }
);

export default adminSlice.reducer;
