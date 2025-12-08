import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import makeRequest from "../../utils/ApiHelper";

const initialState = {
  users: [],
  isLoadingUsers: false,
  usersError: null,

  companyUsers: [],
  isLoadingCompanyUsers: false,
  companyUsersError: null,

  userVerificationForms: [],
  isLoadingUserVerificationForms: false,
  isUpdatingUserVerificationForms: false,

  isCreatingUser: false,
  createUserError: null,

  isDeletingUser: false,
  deleteUserError: null,

  isEditingUser: false,
  editUserError: null,
};

// Async thunks using makeRequest
export const getUsers = createAsyncThunk(
  "user/getUsers",
  ({ token, logoutCallback }) =>
    makeRequest("get", "/api/allUsers", {
      token,
      logoutCallback,
      errorMessage: "Failed to fetch users",
    })
);

export const getCompanyUsers = createAsyncThunk(
  "user/getCompanyUsers",
  ({ token, id, logoutCallback }) =>
    makeRequest("get", `/api/users/company/${id}`, {
      token,
      logoutCallback,
      errorMessage: "Failed to fetch company users",
    })
);

export const getUserVerificationForms = createAsyncThunk(
  "user/getUserVerificationForms",
  ({ token, logoutCallback }) =>
    makeRequest("get", "/api/allForms?page=0&limit=1000000000", {
      token,
      logoutCallback,
      errorMessage: "Failed to fetch verification forms",
    })
);

export const updateUserVerificationForms = createAsyncThunk(
  "user/updateUserVerificationForms",
  ({ id, payload, token, logoutCallback }) =>
    makeRequest("put", `/api/update-form/${id}`, {
      token,
      data: payload,
      logoutCallback,
      errorMessage: "Failed to update verification form",
    })
);

export const createUser = createAsyncThunk(
  "user/createUser",
  ({ data, token }) =>
    makeRequest("post", "/api/user", {
      data,
      token,
      successMessage: "User created successfully",
      errorMessage: "Failed to create user",
    })
);

export const deleteUser = createAsyncThunk(
  "user/deleteUser",
  ({ id, token }) =>
    makeRequest("delete", `/api/user/${id}`, {
      token,
      successMessage: "User deleted successfully",
      errorMessage: "Failed to delete user",
    })
);

export const editUser = createAsyncThunk(
  "user/editUser",
  ({ id, data, token }) =>
    makeRequest("put", `/api/user/${id}`, {
      data,
      token,
      successMessage: "User updated successfully",
      errorMessage: "Failed to update user",
    })
);

const userSlice = createSlice({
  name: "user",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      // getUsers
      .addCase(getUsers.pending, (state) => {
        state.isLoadingUsers = true;
        state.usersError = null;
      })
      .addCase(getUsers.fulfilled, (state, action) => {
        state.isLoadingUsers = false;
        state.users = Array.isArray(action.payload) ? action.payload[0] : action.payload;
      })
      .addCase(getUsers.rejected, (state, action) => {
        state.isLoadingUsers = false;
        state.usersError = action.payload;
      })

      // getCompanyUsers
      .addCase(getCompanyUsers.pending, (state) => {
        state.isLoadingCompanyUsers = true;
        state.companyUsersError = null;
      })
      .addCase(getCompanyUsers.fulfilled, (state, action) => {
        state.isLoadingCompanyUsers = false;
        state.companyUsers = Array.isArray(action.payload) ? action.payload[0] : action.payload;
      })
      .addCase(getCompanyUsers.rejected, (state, action) => {
        state.isLoadingCompanyUsers = false;
        state.companyUsersError = action.payload;
      })

      // getUserVerificationForms
      .addCase(getUserVerificationForms.pending, (state) => {
        state.isLoadingUserVerificationForms = true;
      })
      .addCase(getUserVerificationForms.fulfilled, (state, action) => {
        state.isLoadingUserVerificationForms = false;
        state.userVerificationForms = Array.isArray(action.payload) ? action.payload[0] : action.payload;
      })
      .addCase(getUserVerificationForms.rejected, (state) => {
        state.isLoadingUserVerificationForms = false;
      })
      .addCase(updateUserVerificationForms.pending, (state) => {
        state.isUpdatingUserVerificationForms = true;
      })
      .addCase(updateUserVerificationForms.fulfilled, (state) => {
        state.isUpdatingUserVerificationForms = false;
      })
      .addCase(updateUserVerificationForms.rejected, (state) => {
        state.isUpdatingUserVerificationForms = false;
      })

      // createUser
      .addCase(createUser.pending, (state) => {
        state.isCreatingUser = true;
        state.createUserError = null;
      })
      .addCase(createUser.fulfilled, (state, action) => {
        state.isCreatingUser = false;
        state.users.push(action.payload);
      })
      .addCase(createUser.rejected, (state, action) => {
        state.isCreatingUser = false;
        state.createUserError = action.payload;
      })

      // deleteUser
      .addCase(deleteUser.pending, (state) => {
        state.isDeletingUser = true;
        state.deleteUserError = null;
      })
      .addCase(deleteUser.fulfilled, (state, action) => {
        state.isDeletingUser = false;
        state.users = state.users.filter((u) => u.id !== action.payload);
      })
      .addCase(deleteUser.rejected, (state, action) => {
        state.isDeletingUser = false;
        state.deleteUserError = action.payload;
      })

      // editUser
      .addCase(editUser.pending, (state) => {
        state.isEditingUser = true;
        state.editUserError = null;
      })
      .addCase(editUser.fulfilled, (state, action) => {
        state.isEditingUser = false;
        const updated = action.payload;
        state.users = state.users.map((u) =>
          u.id === updated.id ? { ...u, ...updated } : u
        );
      })
      .addCase(editUser.rejected, (state, action) => {
        state.isEditingUser = false;
        state.editUserError = action.payload;
      });
  },
});

export default userSlice.reducer;
