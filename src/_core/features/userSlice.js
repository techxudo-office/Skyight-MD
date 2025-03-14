import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import axios from "axios";
import { BASE_URL } from "../../utils/ApiBaseUrl";
import toast from "react-hot-toast";

const initialState = {
  users: [],
  isLoadingUsers: false,
  usersError: null,

  isCreatingUser: false,
  createUserError: null,

  isDeletingUser: false,
  deleteUserError: null,
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
        console.log(action.payload);
        state.users = action.payload[0];
      })
      .addCase(getUsers.rejected, (state, action) => {
        state.isLoadingUsers = false;
        state.usersError = action.payload;
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
      });
  },
});

export const getUsers = createAsyncThunk(
  "user/getUsers",
  async (token, thunkAPI) => {
    try {
      const response = await axios.get(`${BASE_URL}/api/user/company-user`, {
        headers: {
          Authorization: token,
        },
      });
      return response?.data?.data;
    } catch (error) {
      const errorMessage =
        error.response?.data?.message || "Failed to fetch users.";
      toast.error(errorMessage);
      return thunkAPI.rejectWithValue(errorMessage);
    }
  }
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
      console.log(error);
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
      let response = await axios.delete(`${BASE_URL}/api/user/${id}`, {
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

export default userSlice.reducer;
