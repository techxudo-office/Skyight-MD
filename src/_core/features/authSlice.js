import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import makeRequest from "./ApiHelper";

const initialState = {
  isLoadingForgotPassword: false,
  forgotPasswordError: null,

  isLoadingRegister: false,
  registerError: null,

  isLoadingVerifyOTP: false,
  verifyOTPError: null,

  isLoadingResendCode: false,
  resendCodeError: null,

  isUpdatingAccount: false,
  updateAccountError: null,
};

const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    updateAdminData: (state, action) => {
      state.adminData = action.payload;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(logout.fulfilled, (state) => {
        state.adminData = null;
      })
      .addCase(forgotPassword.pending, (state) => {
        state.isLoadingForgotPassword = true;
        state.forgotPasswordError = null;
      })
      .addCase(forgotPassword.fulfilled, (state) => {
        state.isLoadingForgotPassword = false;
      })
      .addCase(forgotPassword.rejected, (state, action) => {
        state.isLoadingForgotPassword = false;
        state.forgotPasswordError = action.payload;
      })
      .addCase(register.pending, (state) => {
        state.isLoadingRegister = true;
        state.registerError = null;
      })
      .addCase(register.fulfilled, (state) => {
        state.isLoadingRegister = false;
      })
      .addCase(register.rejected, (state, action) => {
        state.isLoadingRegister = false;
        state.registerError = action.payload;
      })
      .addCase(verifyOTP.pending, (state) => {
        state.isLoadingVerifyOTP = true;
        state.verifyOTPError = null;
      })
      .addCase(verifyOTP.fulfilled, (state) => {
        state.isLoadingVerifyOTP = false;
      })
      .addCase(verifyOTP.rejected, (state, action) => {
        state.isLoadingVerifyOTP = false;
        state.verifyOTPError = action.payload;
      })
      .addCase(resendCode.pending, (state) => {
        state.isLoadingResendCode = true;
        state.resendCodeError = null;
      })
      .addCase(resendCode.fulfilled, (state) => {
        state.isLoadingResendCode = false;
      })
      .addCase(resendCode.rejected, (state, action) => {
        state.isLoadingResendCode = false;
        state.resendCodeError = action.payload;
      })

      .addCase(updateAccount.pending, (state) => {
        state.isUpdatingAccount = true;
      })
      .addCase(updateAccount.fulfilled, (state, action) => {
        state.isUpdatingAccount = false;
        state.adminData = {
          ...state.adminData,
          admin: action.payload,
        };
      })
      .addCase(updateAccount.rejected, (state, action) => {
        state.isUpdatingAccount = false;
        state.updateAccountError = action.payload;
      });
  },
});



export const logout = createAsyncThunk(
  "auth/logout",
  async (token) => {
    const response = await makeRequest(
      'GET',
      '/api/logout',
      {
        token,
        successMessage: "Logout Successfully",
        errorMessage: "Logout failed",
        headers: {
          Accept: "application/json",
          "Content-Type": "application/json"
        }
      }
    );
    return response?.message || response;
  }
);

export const forgotPassword = createAsyncThunk(
  "auth/forgotPassword",
  async (payload) => {
    const response = await makeRequest(
      'POST',
      '/api/forgot-password',
      {
        data: payload,
        successMessage: "Forgot Password Successfully",
        errorMessage: "Forgot password request failed"
      }
    );
    return response?.message || response;
  }
);

export const register = createAsyncThunk(
  "auth/registerCompany",
  async (payload) => {
    const response = await makeRequest(
      'POST',
      '/api/register-company',
      {
        data: payload,
        successMessage: "Registration successful. Verify OTP...",
        errorMessage: "Registration failed. Please try again."
      }
    );
    return response?.message || response;
  }
);

export const verifyOTP = createAsyncThunk(
  "auth/verifyOTP",
  async (payload) => {
    const response = await makeRequest(
      'POST',
      '/api/verify-verification-code',
      {
        data: payload,
        successMessage: "OTP Verified Successfully",
        errorMessage: "OTP verification failed"
      }
    );
    return response?.message || response;
  }
);

export const resendCode = createAsyncThunk(
  "auth/resendCode",
  async (payload) => {
    const response = await makeRequest(
      'POST',
      '/api/resend-verification-code',
      {
        data: payload,
        successMessage: "Verification code resent successfully",
        errorMessage: "Failed to resend verification code"
      }
    );
    return response?.message || response;
  }
);

export const updateAccount = createAsyncThunk(
  "auth/updateAccount",
  async ({ token, data, id }) => {
    const response = await makeRequest(
      'PUT',
      `/api/admin/${id}`,
      {
        data,
        token,
        successMessage: "Account updated successfully",
        errorMessage: "Failed while updating your Account"
      }
    );
    return response?.data || response;
  }
);

export const { updateAdminData } = authSlice.actions;
export default authSlice.reducer;
