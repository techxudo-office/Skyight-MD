import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import makeRequest from "../../utils/ApiHelper";

// Initial state for authentication-related operations
const initialState = {
  isLoading: false,

  qrCode: null,
  isGeneratingQrCode: false,

  isLoadingForgotPassword: false,
  forgotPasswordError: null,

  isLoadingRegister: false,
  registerError: null,

  isLoadingVerifyOTP: false,
  verifyOTPError: null,

  isLoadingResendCode: false,
  resendCodeError: null,
};

// Auth slice to manage registration, password reset, OTP verification, and account update
const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    // Manually update admin data in the state
    updateAdminData: (state, action) => {
      state.adminData = action.payload;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(login.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(login.fulfilled, (state) => {
        state.isLoading = false;
      })
      .addCase(login.rejected, (state) => {
        state.isLoading = false;
      })
      // Clears admin data on logout
      .addCase(logout.fulfilled, (state) => {
        state.adminData = null;
      })

      // Forgot password cases
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

      // Registration cases
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

      // OTP verification cases
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

      // Resend verification code cases
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
      //Authentication
      .addCase(qrCodeGenerator.pending, (state) => {
        state.isGeneratingQrCode = true;
      })
      .addCase(qrCodeGenerator.fulfilled, (state, action) => {
        state.isGeneratingQrCode = false;
        state.qrCode = action.payload; // Assuming the response contains the QR code
      })
      .addCase(qrCodeGenerator.rejected, (state) => {
        state.isGeneratingQrCode = false;
      })
  },
});


export const login = createAsyncThunk("auth/login", (payload) =>
  makeRequest("post", "/api/login", {
    data: payload,
    successMessage: "OTP sent successfully",
    errorMessage: "Login failed. Please try again.",
  })
);

// Async thunk to handle admin logout
export const logout = createAsyncThunk("auth/logout", async (token) => {
  const response = await makeRequest("GET", "/api/logout", {
    token,
    successMessage: "Logout Successfully",
    errorMessage: "Logout failed",
    headers: {
      Accept: "application/json",
      "Content-Type": "application/json",
    },
  });
  return response?.message || response;
});
// QR Code Generator for login
export const qrCodeGenerator = createAsyncThunk("auth/qrCodeGenerator", (payload) =>
  makeRequest("post", "/api/generate-qrcode", {
    data: payload,
    errorMessage: "Qr Code Failed. Please try again.",
  })
);
// Async thunk to send forgot password request
export const forgotPassword = createAsyncThunk(
  "auth/forgotPassword",
  async (payload) => {
    const response = await makeRequest("POST", "/api/forgot-password", {
      data: payload,
      successMessage: "Forgot Password Successfully",
      errorMessage: "Forgot password request failed",
    });
    return response?.message || response;
  }
);

// Async thunk for company registration
export const register = createAsyncThunk(
  "auth/registerCompany",
  async (payload) => {
    const response = await makeRequest("POST", "/api/register-company", {
      data: payload,
      successMessage: "Registration successful. Verify OTP...",
      errorMessage: "Registration failed. Please try again.",
    });
    return response?.message || response;
  }
);

// Async thunk to verify the OTP code
export const verifyOTP = createAsyncThunk("auth/verifyOTP", async (payload) => {
  const response = await makeRequest("POST", "/api/verify-verification-code", {
    data: payload,
    successMessage: "OTP Verified Successfully",
    errorMessage: "OTP verification failed",
  });
  return response?.message || response;
});

// Async thunk to resend the verification code
export const resendCode = createAsyncThunk(
  "auth/resendCode",
  async (payload) => {
    const response = await makeRequest(
      "POST",
      "/api/resend-verification-code",
      {
        data: payload,
        successMessage: "Verification code resent successfully",
        errorMessage: "Failed to resend verification code",
      }
    );
    return response?.message || response;
  }
);

// Request to resend the Login OTP code again
export const resendLoginCode = createAsyncThunk("auth/resendLoginCode", (payload) =>
  makeRequest("post", "/api/resend-verification-code-login", {
    data: payload,
    successMessage: "Verification code resent successfully",
    errorMessage: "Failed to resend verification code",
  })
);

// Export action to manually update admin data from components
export const { updateAdminData } = authSlice.actions;

// Export reducer
export default authSlice.reducer;
