import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import axios from "axios";
import { BASE_URL } from "../../utils/ApiBaseUrl";
import toast from "react-hot-toast";

const initialState = {
  admins: [],
  isLoadingAdmins: false,
  adminsError: null,

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
      .addCase(deleteAdmin.pending, (state) => {
        state.isDeletingAdmin = true;
        state.deleteAdminError = null;
      })
      .addCase(deleteAdmin.fulfilled, (state, action) => {
        state.isDeletingAdmin = false;
        state.admins = state.admins.filter((admin) => admin.id !== action.payload);
      })
      .addCase(deleteAdmin.rejected, (state, action) => {
        state.isDeletingAdmin = false;
        state.deleteAdminError = action.payload;
      })
      .addCase(editUser.pending, (state) => {
        state.isEditingUser = true;
        state.editUserError = null;
      })
      .addCase(editUser.fulfilled, (state, action) => {
        state.isEditingUser = false;
        const updatedUser = action.payload;
        console.log(updatedUser);
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

export const editUser = createAsyncThunk(
  "user/editUser",
  async ({ id, token, data }, thunkAPI) => {
    try {
      console.log(data, "data");
      const response = await axios.put(`${BASE_URL}/api/user/${id}`, data, {
        headers: {
          Authorization: token,
        },
      });

      if (response.status === 200) {
        toast.success("User updated successfully");
        return response.data.data;
      }
    } catch (error) {
      const errorMessage =
        error?.response?.data?.message || "Failed while updating this User";
      toast.error(errorMessage);
      return thunkAPI.rejectWithValue(errorMessage);
    }
  }
);

export default adminSlice.reducer;
