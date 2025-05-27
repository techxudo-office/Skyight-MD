import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import makeRequest from "./ApiHelper";

const initialState = {
  banks: [],
  isLoadingBanks: false,
  banksError: null,

  isLoadingDeleteBank: false,
  deleteBankError: null,

  isCreatingbank: false,
  createBankError: null,

  isEditingBank: false,
  editBankError: null,
};

const bankSlice = createSlice({
  name: "bank",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(getBanks.pending, (state) => {
        state.isLoadingBanks = true;
      })
      .addCase(getBanks.fulfilled, (state, action) => {
        state.banks = action.payload;
        state.isLoadingBanks = false;
      })
      .addCase(getBanks.rejected, (state, action) => {
        state.isLoadingBanks = false;
        state.banksError = action.payload;
      })

      .addCase(deleteBank.pending, (state) => {
        state.isLoadingDeleteBank = true;
        state.deleteBankError = null;
      })
      .addCase(deleteBank.fulfilled, (state, action) => {
        state.isLoadingDeleteBank = false;
        state.deleteBankError = null;
        state.banks = state.banks.filter((bank) => bank.id !== action.payload);
      })
      .addCase(deleteBank.rejected, (state, action) => {
        state.isLoadingDeleteBank = false;
        state.deleteBankError = action.payload;
      })
      .addCase(createBank.pending, (state) => {
        state.isCreatingbank = true;
        state.createBankError = null;
      })
      .addCase(createBank.fulfilled, (state, action) => {
        state.isCreatingbank = false;
        state.banks.push(action.payload);
      })
      .addCase(createBank.rejected, (state, action) => {
        state.isCreatingbank = false;
        state.createBankError = action.payload;
      })
      .addCase(editBank.pending, (state) => {
        state.isEditingBank = true;
        state.editBankError = null;
      })
      .addCase(editBank.fulfilled, (state, action) => {
        state.isEditingBank = false;
        const updatedbank = action.payload;
        state.banks = state.banks.map((bank) =>
          bank.id === updatedbank.id ? { ...bank, ...updatedbank } : bank
        );
      })
      .addCase(editBank.rejected, (state, action) => {
        state.isEditingBank = false;
        state.editBankError = action.payload;
      });
  },
});

export const getBanks = createAsyncThunk(
  "booking/getBanks",
  async ({ token, logoutHandler }) => {
    const response = await makeRequest("GET", "/api/bank", {
      token,
      logoutCallback: logoutHandler,
      errorMessage: "Failed to fetch banks",
    });
    if (response?.data?.data.length > 0) {
      return response.data.data;
    }
  }
);

export const deleteBank = createAsyncThunk(
  "bank/deleteBank",
  async ({ token, id }) => {
    await makeRequest("DELETE", `/api/bank?bank_id=${id}`, {
      token,
      successMessage: "Bank deleted successfully",
      errorMessage: "Failed to delete bank",
    });
    return id;
  }
);

export const createBank = createAsyncThunk(
  "bank/createBank",
  async ({ data, token }) => {
    const response = await makeRequest("POST", "/api/bank", {
      data,
      token,
      successMessage: "Bank created successfully",
      errorMessage: "Failed to create bank",
      headers: { "Content-Type": "application/json" },
    });
    return response?.data || response;
  }
);

export const editBank = createAsyncThunk(
  "bank/editBank",
  async ({ id, token, data }) => {
    const payload = {
      bank_id: id,
      bank: data,
    };
    const response = await makeRequest("PUT", "/api/bank", {
      data: payload,
      token,
      successMessage: "Bank updated successfully",
      errorMessage: "Failed while updating this bank",
    });
    return response?.data.data || response;
  }
);

export default bankSlice.reducer;
