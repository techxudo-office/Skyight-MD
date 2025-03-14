import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import axios from "axios";
import { BASE_URL } from "../../utils/ApiBaseUrl";
import toast from "react-hot-toast";

const initialState = {
  roles: [],
  isLoadingRoles: false,
  isLoadingCreateRole: false,
  rolesError: null,
  totalPages: 1,
};

const roleSlice = createSlice({
  name: "role",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(getRoles.pending, (state) => {
        state.isLoadingRoles = true;
        state.rolesError = null;
      })
      .addCase(getRoles.fulfilled, (state, action) => {
        state.isLoadingRoles = false;

        if (action.payload?.data?.roles) {
          state.roles = action.payload.data.roles.map((item) => ({
            id: item.id.toString(),
            role: item.name || "Unknown",
            roleRights: item.page_permission
              ? Object.keys(item.page_permission)
                  .filter((key) => item.page_permission[key])
                  .map((key) => key.replace(/_/g, " "))
                  .join(", ")
              : "No Permissions",
            status: item.is_deleted ? "inactive" : "active",
          }));
        } else {
          state.roles = [];
        }
        state.totalPages = action.payload?.totalPages || 0;
      })
      .addCase(getRoles.rejected, (state, action) => {
        state.isLoadingRoles = false;
        state.rolesError = action.payload;
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

export const getRoles = createAsyncThunk(
  "role/getRoles",
  async ({ page = 0, limit = 10, token }, thunkAPI) => {
    try {
      const response = await axios.get(`${BASE_URL}/api/role`, {
        headers: {
          Authorization: token,
        },
      });

      return {
        data: response.data.data,
        totalPages: response.data.totalPages || 1,
      };
    } catch (error) {
      const errorMessage =
        error?.response?.data?.message || "Failed to fetch roles.";
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

export default roleSlice.reducer;
