import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import axios from "axios";
import { BASE_URL } from "../../utils/ApiBaseUrl";
import toast from "react-hot-toast";
import makeRequest from "../../utils/ApiHelper";

const initialState = {
  transactions: [],
  isLoadingTransactions: false,
  transactionsError: null,

  companyTransactions: [],
  isLoadingCompanyTransactions: false,
  companyTransactionsError: null,

  isCreatingTransaction: false,
  createTransactionError: null,

  isEditingTransaction: false,
  editTransactionError: null,
};

const transactionSlice = createSlice({
  name: "transaction",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(getTransactions.pending, (state) => {
        state.isLoadingTransactions = true;
        state.transactionsError = null;
      })
      .addCase(getTransactions.fulfilled, (state, action) => {
        state.isLoadingTransactions = false;
        state.transactions = action.payload;
      })
      .addCase(getTransactions.rejected, (state, action) => {
        state.isLoadingTransactions = false;
        state.transactionsError = action.payload;
      })
      .addCase(getCompanyTransactions.pending, (state) => {
        state.isLoadingCompanyTransactions = true;
        state.companyTransactionsError = null;
      })
      .addCase(getCompanyTransactions.fulfilled, (state, action) => {
        state.isLoadingCompanyTransactions = false;
        state.companyTransactions = action?.payload[0];
      })
      .addCase(getCompanyTransactions.rejected, (state, action) => {
        state.isLoadingCompanyTransactions = false;
        state.companyTransactionsError = action.payload;
      })
      .addCase(createTransaction.pending, (state) => {
        state.isCreatingTransaction = true;
        state.createTransactionError = null;
      })
      .addCase(createTransaction.fulfilled, (state, action) => {
        state.isCreatingTransaction = false;
        state.transactions = [action.payload, ...state.transactions];
      })
      .addCase(createTransaction.rejected, (state, action) => {
        state.isCreatingTransaction = false;
        state.createTransactionError = action.payload;
      })
      .addCase(editTransaction.pending, (state) => {
        state.isEditingTransaction = true;
        state.editTransactionError = null;
      })
      .addCase(editTransaction.fulfilled, (state, action) => {
        state.isEditingTransaction = false;
        const transaction = action.payload;
        state.transactions = state.transactions.map((tran) =>
          tran.id === transaction.id ? { ...tran, ...transaction } : tran
        );
      })
      .addCase(editTransaction.rejected, (state, action) => {
        state.isEditingTransaction = false;
        state.editTransactionError = action.payload;
      });
  },
});

export const getTransactions = createAsyncThunk(
  "transaction/getTransactions",
  async ({ token, logoutHandler }) => {
    const response = await makeRequest(
      "GET",
      `/api/company/all-transactions?page=0&limit=10000`,
      {
        token,
        logoutCallback: logoutHandler,
        errorMessage: "Failed to fetch transactions.",
      }
    );
    return response.data.data[0];
  }
);

export const getCompanyTransactions = createAsyncThunk(
  "transaction/getCompanyTransactions",
  async ({ token, id, logoutHandler}) => {
    const response = await makeRequest(
      "GET",
      `/api/company/getCompanyCredits/${id}?page=0&limit=10000`,
      {
        token,
        logoutCallback: logoutHandler,
        errorMessage: "Failed to fetch transactions.",
      }
    );
    return response.data.data;
  }
);

export const createTransaction = createAsyncThunk(
  "transaction/createTransaction",
  async ({ data, token }, thunkAPI) => {
    try {
      const response = await axios.post(
        `${BASE_URL}/api/company/create-transaction`,
        data,
        {
          headers: {
            Accept: "multipart/form-data",
            "Content-Type": "multipart/form-data",
            Authorization: token,
          },
        }
      );

      if (response.status === 200) {
        toast.success("Transaction created successfully!");
        return response.data;
      }
    } catch (error) {
      const errorMessage =
        error?.response?.data?.message || "Failed to create transaction";
      toast.error(errorMessage);
      return thunkAPI.rejectWithValue(errorMessage);
    }
  }
);

export const editTransaction = createAsyncThunk(
  "transaction/editTransaction",
  async ({ token, data }, thunkAPI) => {
    try {
      const response = await axios.put(
        `${BASE_URL}/api/company/update-transaction`,
        data,
        {
          headers: {
            Authorization: token,
          },
        }
      );

      if (response.status === 200) {
        toast.success("Transaction updated successfully");
        return response.data.data;
      }
    } catch (error) {
      const errorMessage =
        error?.response?.data?.message ||
        "Failed while updating this Transaction";
      toast.error(errorMessage);
      return thunkAPI.rejectWithValue(errorMessage);
    }
  }
);

export default transactionSlice.reducer;
