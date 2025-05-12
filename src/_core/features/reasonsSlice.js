import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import makeRequest from "./ApiHelper";


const initialState = {
  reasons: [],
  isLoadingReasons: false,
  reasonsError: null,

  isLoadingDeleteReason: false,
  deleteReasonError: null,

  isCreatingReason: false,
  createReasonError: null,

  isEditingReason: false,
  editReasonError: null,
};

const reasonsSlice = createSlice({
  name: "reasons",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(getReasons.pending, (state) => {
        state.isLoadingReasons = true;
      })
      .addCase(getReasons.fulfilled, (state, action) => {
        state.reasons = action.payload;
        state.isLoadingReasons = false;
      })
      .addCase(getReasons.rejected, (state, action) => {
        state.isLoadingReasons = false;
        state.reasonsError = action.payload;
      })
      .addCase(deleteReason.pending, (state) => {
        state.isLoadingDeleteReason = true;
        state.deleteReasonError = null;
      })
      .addCase(deleteReason.fulfilled, (state, action) => {
        state.deleteReasonError = null;
        state.reasons = state.reasons.filter(
          (reason) => reason.id !== action.payload
        );
        state.isLoadingDeleteReason = false;
      })
      .addCase(deleteReason.rejected, (state, action) => {
        state.isLoadingDeleteReason = false;
        state.deleteReasonError = action.payload;
      })
      .addCase(createReason.pending, (state) => {
        state.isCreatingReason = true;
        state.createReasonError = null;
      })
      .addCase(createReason.fulfilled, (state, action) => {
        state.isCreatingReason = false;
        state.reasons.push(action.payload);
      })
      .addCase(createReason.rejected, (state, action) => {
        state.isCreatingReason = false;
        state.createReasonError = action.payload;
      })

      .addCase(editReason.pending, (state) => {
        state.isEditingReason = true;
        state.editReasonError = null;
      })
      .addCase(editReason.fulfilled, (state, action) => {
        state.isEditingReason = false;
        const updatedreason = action.payload;
        state.reasons = state.reasons.map((reason) =>
          reason.id === updatedreason.id
            ? { ...reason, ...updatedreason }
            : reason
        );
      })
      .addCase(editReason.rejected, (state, action) => {
        state.isEditingReason = false;
        state.editReasonError = action.payload;
      });
  },
});

export const getReasons = createAsyncThunk(
  "reason/getReasons",
  async (token) => {
    const response = await makeRequest(
      'GET',
      '/api/reason',
      {
        token,
        errorMessage: "Failed to fetch reasons."
      }
    );

    if (response?.data?.data?.length > 0) {
      return response?.data.data;
    }
    throw new Error("No reasons found");
  }
);

export const deleteReason = createAsyncThunk(
  "reason/deleteReason",
  async ({ token, id }) => {
    await makeRequest(
      'DELETE',
      `/api/reason/${id}`,
      {
        token,
        successMessage: "Reason deleted successfully",
        errorMessage: "Failed to delete reason"
      }
    );
    return id;
  }
);

export const createReason = createAsyncThunk(
  "reason/createReason",
  async ({ data, token }) => {
    const response = await makeRequest(
      'POST',
      '/api/reason',
      {
        data,
        token,
        successMessage: "Reason created successfully",
        errorMessage: "Failed to create reason",
        headers: { "Content-Type": "application/json" }
      }
    );
    return response.data?.data;
  }
);

export const editReason = createAsyncThunk(
  "reason/editReason",
  async ({ id, token, data }) => {
    const payload = {
      reason_id: id,
      reason: data,
    };
    const response = await makeRequest(
      'PUT',
      `/api/reason/${id}`,
      {
        data: payload,
        token,
        successMessage: "Reason updated successfully",
        errorMessage: "Failed while updating this reason"
      }
    );
    return response.data?.data;
  }
);

export default reasonsSlice.reducer;
