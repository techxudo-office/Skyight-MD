import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import axios from "axios";
import { BASE_URL } from "../../utils/ApiBaseUrl";
import toast from "react-hot-toast";

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
  async (token, thunkAPI) => {
    try {
      const response = await axios.get(`${BASE_URL}/api/bank`, {
        headers: {
          Authorization: token,
        },
      });
      if (response?.data.data?.length > 0) {
        // const extractedData = response.data.data[0].map(({ id, bank }) => ({
        //   value: id,
        //   label: bank,
        // }));
        return response?.data.data;
      } else {
        throw new Error("No Banks Found");
      }
    } catch (error) {
      const errorMessage =
        error?.response?.data?.message || "Failed to fetch banks";
      toast.error(errorMessage);
      return thunkAPI.rejectWithValue(errorMessage);
    }
  }
);
export const deleteBank = createAsyncThunk(
  "bank/deleteBank",
  async ({ token, id }, thunkAPI) => {
    try {
      const response = await axios.delete(
        `${BASE_URL}/api/bank?bank_id=${id}`,
        {
          headers: {
            Authorization: token,
          },
        }
      );

      if (response?.status === 200) {
        toast.success("bank deleted successfully");
        return id;
      }
    } catch (error) {
      const errorMessage =
        error?.response?.data?.message || "Failed to delete bank.";
      toast.error(errorMessage);
      return thunkAPI.rejectWithValue(errorMessage);
    }
  }
);

export const createBank = createAsyncThunk(
  "bank/createBank",
  async ({ data, token }, thunkAPI) => {
    try {
      const response = await axios.post(`${BASE_URL}/api/bank`, data, {
        headers: {
          Authorization: token,
          "Content-Type": "application/json",
        },
      });
      toast.success("bank created successfully");
      return response?.data.data;
    } catch (error) {

      const errorMessage =
        error.response?.data?.message || "Failed to create bank.";
      toast.error(errorMessage);
      return thunkAPI.rejectWithValue(errorMessage);
    }
  }
);

export const editBank = createAsyncThunk(
  "bank/editBank",
  async ({ id, token, data }, thunkAPI) => {
    const payload = {
      bank_id: id,
      bank: data,
    };
    try {

      const response = await axios.put(`${BASE_URL}/api/bank/`, payload, {
        headers: {
          Authorization: token,
        },
      });

      if (response.status === 200) {
        toast.success("bank updated successfully");
        return response.data.data;
      }
    } catch (error) {
      const errorMessage =
        error?.response?.data?.message || "Failed while updating this bank";
      toast.error(errorMessage);
      return thunkAPI.rejectWithValue(errorMessage);
    }
  }
);

export default bankSlice.reducer;
