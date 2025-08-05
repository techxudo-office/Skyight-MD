import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import makeRequest from "../../utils/ApiHelper";

const initialState = {
  commisions: [],
  isLoadingCommision: false,
  commisionError: null,

  isCreatingcommision: false,
  createcommisionError: null,

  isEditingcommision: false,
  editcommisionError: null,
};

const commisionSlice = createSlice({
  name: "commision",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(getCommision.pending, (state) => {
        state.isLoadingCommision = true;
        state.commisionError = null;
      })
      .addCase(getCommision.fulfilled, (state, action) => {
        state.isLoadingCommision = false;
        state.commisions = action.payload;
      })
      .addCase(getCommision.rejected, (state, action) => {
        state.isLoadingCommision = false;
        state.commisionError = action.payload;
      })
      .addCase(editcommision.pending, (state) => {
        state.isEditingcommision = true;
        state.editcommisionError = null;
      })
      .addCase(editcommision.fulfilled, (state, action) => {
        state.isEditingcommision = false;
        state.commisions = action.payload;
      })
      .addCase(editcommision.rejected, (state, action) => {
        state.isEditingcommision = false;
        state.editcommisionError = action.payload;
      });
  },
});
export const getCommision = createAsyncThunk(
  "commision/getCommision",
  async (token) =>
    makeRequest(
      'GET',
      '/api/fetch-commission',
      {
        token,
        errorMessage: "Failed to fetch commissions"
      }
    )
);

export const editcommision = createAsyncThunk(
  "commision/editcommision",
  async ({ token, data }) =>
    makeRequest(
      'POST',
      '/api/update-Commission',
      {
        data,
        token,
        successMessage: "Commission updated successfully",
        errorMessage: "Failed while updating this commission"
      }
    )
);

export default commisionSlice.reducer;
