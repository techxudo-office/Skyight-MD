import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import axios from "axios";
import { BASE_URL } from "../../utils/ApiBaseUrl";
import toast from "react-hot-toast";
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

const userSlice = createSlice({
  name: "user",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(getUsers.pending, (state) => {
        state.isLoadingUsers = true;
        state.usersError = null;
      })
      .addCase(getUsers.fulfilled, (state, action) => {
        state.isLoadingUsers = false;
        state.users = action.payload[0];
      })
      .addCase(getUsers.rejected, (state, action) => {
        state.isLoadingUsers = false;
        state.usersError = action.payload;
      })
      .addCase(getCompanyUsers.pending, (state) => {
        state.isLoadingCompanyUsers = true;
        state.companyUsersError = null;
      })
      .addCase(getCompanyUsers.fulfilled, (state, action) => {
        state.isLoadingCompanyUsers = false;
        state.companyUsers = action.payload[0];
      })
      .addCase(getCompanyUsers.rejected, (state, action) => {
        state.isLoadingCompanyUsers = false;
        state.companyUsersError = action.payload;
      })
      .addCase(getUserVerificationForms.pending, (state) => {
        state.isLoadingUserVerificationForms = true;
      })
      .addCase(getUserVerificationForms.fulfilled, (state, action) => {
        state.isLoadingUserVerificationForms = false;
        state.userVerificationForms = action.payload[0];
      })
      .addCase(getUserVerificationForms.rejected, (state, action) => {
        state.isLoadingUserVerificationForms = false;
      })
      .addCase(updateUserVerificationForms.pending, (state) => {
        state.isUpdatingUserVerificationForms = true;
      })
      .addCase(updateUserVerificationForms.fulfilled, (state, action) => {
        state.isUpdatingUserVerificationForms = false;
      })
      .addCase(updateUserVerificationForms.rejected, (state, action) => {
        state.isUpdatingUserVerificationForms = false;
      })
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
      .addCase(deleteUser.pending, (state) => {
        state.isDeletingUser = true;
        state.deleteUserError = null;
      })
      .addCase(deleteUser.fulfilled, (state, action) => {
        state.isDeletingUser = false;
        state.users = state.users.filter((user) => user.id !== action.payload);
      })
      .addCase(deleteUser.rejected, (state, action) => {
        state.isDeletingUser = false;
        state.deleteUserError = action.payload;
      })
      .addCase(editUser.pending, (state) => {
        state.isEditingUser = true;
        state.editUserError = null;
      })
      .addCase(editUser.fulfilled, (state, action) => {
        state.isEditingUser = false;
        const updatedUser = action.payload;
        state.users = state.users.map((user) =>
          user.id === updatedUser.id ? { ...user, ...updatedUser } : user
        );
      })
      .addCase(editUser.rejected, (state, action) => {
        state.isEditingUser = false;
        state.editUserError = action.payload;
      });
  },
});

export const getUsers = createAsyncThunk(
  "user/getUsers",
  async (token, thunkAPI) => {
    try {
      const response = await axios.get(`${BASE_URL}/api/allUsers`, {
        headers: {
          Authorization: token,
        },
      });
      return response;
    } catch (error) {
      const errorMessage =
        error.response?.data?.message || "Failed to fetch users.";
      toast.error(errorMessage);
      return thunkAPI.rejectWithValue(errorMessage);
    }
  }
);
export const getCompanyUsers = createAsyncThunk(
  "user/getCompanyUsers",
  async ({ token, id }, thunkAPI) => {
    try {
      const response = await axios.get(`${BASE_URL}/api/users/company/${id}`, {
        headers: {
          Authorization: token,
        },
      });
      return response;
    } catch (error) {
      const errorMessage =
        error.response?.data?.message || "Failed to fetch company users.";
      toast.error(errorMessage);
      return thunkAPI.rejectWithValue(errorMessage);
    }
  }
);

export const getUserVerificationForms = createAsyncThunk(
  "user/getUserVerificationForms",
  ({ token, logoutHandler }) =>
    makeRequest("get", `/api/allForms`, {
      token,
      logoutHandler,
      errorMessage: "Failed to user verification forms",
    })
);

export const updateUserVerificationForms = createAsyncThunk(
  "user/updateUserVerificationForms",
  ({ id, token, payload, logoutHandler }) =>
    makeRequest("put", `/api/update-form/${id}`, {
      token,
      data: payload,
      logoutHandler,
      errorMessage: "Failed to user verification forms",
    })
);

export const createUser = createAsyncThunk(
  "user/createUser",
  async ({ data, token }, thunkAPI) => {
    try {
      const response = await axios.post(`${BASE_URL}/api/user`, data, {
        headers: {
          Authorization: token,
          "Content-Type": "application/json",
        },
      });
      toast.success("User created successfully");
      return response.data;
    } catch (error) {

      const errorMessage =
        error.response?.data?.message || "Failed to create user.";
      toast.error(errorMessage);
      return thunkAPI.rejectWithValue(errorMessage);
    }
  }
);

export const deleteUser = createAsyncThunk(
  "user/deleteUser",
  async ({ id, token }, thunkAPI) => {
    try {
      const response = await axios.delete(`${BASE_URL}/api/user/${id}`, {
        headers: {
          Authorization: token,
        },
      });

      if (response.status === 200) {
        toast.success("User deleted successfully");
        return id;
      }
    } catch (error) {
      const errorMessage = "Failed while deleting this user";
      toast.error(errorMessage);
      return thunkAPI.rejectWithValue(errorMessage);
    }
  }
);

export const editUser = createAsyncThunk(
  "user/editUser",
  async ({ id, token, data }, thunkAPI) => {
    try {

      const response = await axios.put(`${BASE_URL}/api/user/${id}`, data, {
        headers: {
          Authorization: token,
        },
      });

      if (response.status === 200) {
        toast.success("User updated successfully");
        return response
      }
    } catch (error) {
      const errorMessage =
        error?.response?.data?.message || "Failed while updating this User";
      toast.error(errorMessage);
      return thunkAPI.rejectWithValue(errorMessage);
    }
  }
);

export default userSlice.reducer;
