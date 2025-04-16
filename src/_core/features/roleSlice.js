import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import axios from "axios";
import { BASE_URL } from "../../utils/ApiBaseUrl";
import toast from "react-hot-toast";

const initialState = {
  roles: [],
  isLoadingRoles: false,
  isLoadingCreateRole: false,
  rolesError: null,

  userRoles: [],
  isLoadingUserRoles: false,
  userRolesError: null,

  isEditingRole: false,
  editRoleError: null,

  isDeletingRole: false,
  deleteRoleError: null,

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
        state.roles = action.payload.data.roles;
      })
      .addCase(getRoles.rejected, (state, action) => {
        state.isLoadingRoles = false;
        state.rolesError = action.payload;
      })
      .addCase(getUserRoles.pending, (state) => {
        state.isLoadingUserRoles = true;
        state.userRolesError = null;
      })
      .addCase(getUserRoles.fulfilled, (state, action) => {
        state.isLoadingUserRoles = false;
        state.userRoles = action.payload.data.roles;
      })
      .addCase(getUserRoles.rejected, (state, action) => {
        state.isLoadingUserRoles = false;
        state.userRolesError = action.payload;
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
      })
      .addCase(deleteRole.pending, (state) => {
        state.isDeletingRole = true;
        state.deleteRoleError = null;
      })
      .addCase(deleteRole.fulfilled, (state, action) => {
        state.isDeletingRole = false;
        state.roles = state.roles.filter((role) => role.id !== action.payload);
      })
      .addCase(deleteRole.rejected, (state, action) => {
        state.isDeletingRole = false;
        state.deleteRoleError = action.payload;
      })
      .addCase(editRole.pending, (state) => {
        state.isEditingRole = true;
        state.editRoleError = null;
      })
      .addCase(editRole.fulfilled, (state, action) => {
        state.isEditingRole = false;
        const updatedRole = action.payload;

        if (!Array.isArray(state.roles)) {
          console.error("state.roles is not an array!", state.roles);
          return;
        }

        state.roles = state.roles.map((role) =>
          role.id == updatedRole.id ? { ...role, ...updatedRole } : role
        );

      })
      .addCase(editRole.rejected, (state, action) => {
        state.isEditingRole = false;
        state.editRoleError = action.payload;
      });
  },
});

export const getRoles = createAsyncThunk(
  "role/getRoles",
  async (token, thunkAPI) => {
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

export const getUserRoles = createAsyncThunk(
  "role/getUserRoles",
  async (token, thunkAPI) => {
    try {
      const response = await axios.get(`${BASE_URL}/api/userRole`, {
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
        error?.response?.data?.message || "Failed to fetch user roles.";
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

export const deleteRole = createAsyncThunk(
  "role/deleteRole",
  async ({ id, token }, thunkAPI) => {
    try {
      let response = await axios.delete(`${BASE_URL}/api/role/${id}`, {
        headers: {
          Authorization: token,
        },
      });

      if (response.status === 200) {
        toast.success("Role deleted successfully");
        return id;
      }
    } catch (error) {
      const errorMessage = "Failed while deleting this role";
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

export default roleSlice.reducer;
