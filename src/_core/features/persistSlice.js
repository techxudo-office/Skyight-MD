import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import makeRequest from "../../utils/ApiHelper";

const initialState = {
  adminData: null,
  isLoading: false,

  isUpdatingAccount: false,
};

const persistSlice = createSlice({
  name: "persist",
  initialState,
  reducers: {
    updateAdminData: (state, action) => {
      state.adminData = action.payload;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(login.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(login.fulfilled, (state, action) => {
        state.isLoading = false;
        state.adminData = action.payload;
      })
      .addCase(login.rejected, (state) => {
        state.isLoading = false;
      })
      .addCase(uploadImage.fulfilled, (state, action) => {
        state.adminData = {
          ...state.adminData,
          user: {
            ...state.adminData.admin,
            image_url: action?.payload?.image_url,
          },
        };
      })
      // Update admin account details
      .addCase(updateAccount.pending, (state) => {
        state.isUpdatingAccount = true;
      })
      .addCase(updateAccount.fulfilled, (state, action) => {
        state.isUpdatingAccount = false;
        // Merge updated admin info with existing state
        state.adminData = {
          ...state.adminData,
          admin: action.payload,
        };
      })
      .addCase(updateAccount.rejected, (state, action) => {
        state.isUpdatingAccount = false;
      });
  },
});

export const login = createAsyncThunk("persist/login", async (payload) => {
  const response = await makeRequest("POST", "/api/login", {
    data: payload,
    successMessage: "Login successful",
    errorMessage: "Login failed. Please try again.",
    headers: {
      Accept: "application/json",
      "Content-Type": "application/json",
    },
  });
  return response.data?.data;
});

// Async thunk to update admin account information
export const updateAccount = createAsyncThunk(
  "persist/updateAccount",
  async ({ token, data, id }) => {
    const response = await makeRequest("PUT", `/api/admin/${id}`, {
      data,
      token,
      successMessage: "Account updated successfully",
      errorMessage: "Failed while updating your Account",
    });
    return response?.data || response;
  }
);

export const uploadImage = createAsyncThunk(
  "persist/uploadImage",
  async ({ img, token }, { rejectWithValue }) => {
    try {
      const formData = new FormData();
      formData.append("image", img);
      const response = await makeRequest("post", "/api/user/image", {
        token,
        headers: {
          "Content-Type": "multipart/form-data",
        },
        data: formData,
        successMessage: "Image uploaded successfully",
      });
      return response;
    } catch (err) {
      return rejectWithValue(err);
    }
  }
);

export default persistSlice.reducer;
