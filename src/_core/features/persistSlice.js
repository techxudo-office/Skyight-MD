import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import makeRequest from "./ApiHelper";

const initialState = {
  adminData: null,
  isLoading: false,
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
