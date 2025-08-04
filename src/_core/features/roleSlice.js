import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import makeRequest from "../../utils/ApiHelper";

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
  async ({ token, logoutHandler }) => {
    const response = await makeRequest("GET", "/api/role?is_deleted=false", {
      token,
      logoutCallback: logoutHandler,
      errorMessage: "Failed to fetch roles.",
    });

    return {
      data: response,
      totalPages: response?.data?.totalPages || 1,
    };
  }
);

export const getUserRoles = createAsyncThunk(
  "role/getUserRoles",
  async (token) => {
    const response = await makeRequest("GET", "/api/userRole", {
      token,
      errorMessage: "Failed to fetch user roles.",
    });
    return {
      data: response,
      totalPages: response.data?.totalPages || 1,
    };
  }
);

export const createRole = createAsyncThunk(
  "role/createRole",
  async ({ data, token }) => {
    const response = await makeRequest("POST", "/api/role", {
      data,
      token,
      successMessage: "Role created successfully",
      errorMessage: "Failed to create role.",
      headers: { "Content-Type": "application/json" },
    });
    return response.data;
  }
);

export const deleteRole = createAsyncThunk(
  "role/deleteRole",
  async ({ id, token }) => {
    await makeRequest("DELETE", `/api/role/${id}`, {
      token,
      successMessage: "Role deleted successfully",
      errorMessage: "Failed while deleting this role",
    });
    return id;
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
    return response;
  }
);
export default roleSlice.reducer;
