import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import makeRequest from "../../utils/ApiHelper";

const initialState = {
  partners: [],
  partnersTotal: 0,
  isLoadingPartners: false,
  partnersError: null,

  isCreatingPartner: false,
  createPartnerError: null,

  isDeletingPartner: false,
  deletePartnerError: null,

  isEditingPartner: false,
  editPartnerError: null,

  regeneratingTokenId: null,
  regenerateTokenError: null,
};

// Async thunks using makeRequest
export const getAllPartners = createAsyncThunk(
  "partner/b2bpartners",
  ({ token, logoutCallback }) =>
    makeRequest("get", "/api/b2bpartners", {
      token,
      logoutCallback,
      errorMessage: "Failed to fetch partners",
    })
);

export const addPartner = createAsyncThunk(
  "partner/addb2bpartner",
  ({ token, data, logoutCallback }) =>
    makeRequest("post", "/api/addb2bpartner", {
      token,
      data,
      logoutCallback,
      errorMessage: "Failed to create partner",
      successMessage: "Partner created successfully",
    })
);

export const deletePartner = createAsyncThunk(
  "partner/deletePartner",
  ({ token, id, logoutCallback }) =>
    makeRequest("delete", `/api/b2bpartner/${id}`, {
      token,
      logoutCallback,
      errorMessage: "Failed to delete partner",
      successMessage: "Partner deleted successfully",
    })
);

export const editPartner = createAsyncThunk(
  "partner/editPartner",
  ({ token, id, data, logoutCallback }) =>
    makeRequest("put", `/api/b2bpartner/${id}`, {
      token,
      data,
      logoutCallback,
      errorMessage: "Failed to update partner",
      successMessage: "Partner updated successfully",
    })
);

export const regeneratePartnerToken = createAsyncThunk(
  "partner/regenerateToken",
  ({ token, id, logoutCallback }) =>
    makeRequest("put", `/api/b2bpartner/${id}/regenerate-token`, {
      token,
      logoutCallback,
      errorMessage: "Failed to regenerate token",
      successMessage: "Secret token regenerated successfully",
    })
);

const partnerSlice = createSlice({
  name: "partner",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      // Get all partners
      .addCase(getAllPartners.pending, (state) => {
        state.isLoadingPartners = true;
        state.partnersError = null;
      })
      .addCase(getAllPartners.fulfilled, (state, action) => {
        state.isLoadingPartners = false;
        console.log(action.payload);
        state.partners = action.payload.partners || [];
        state.partnersTotal = action.payload.total || 0;
      })
      .addCase(getAllPartners.rejected, (state, action) => {
        state.isLoadingPartners = false;
        state.partnersError = action.payload;
      })

      // Add partner
      .addCase(addPartner.pending, (state) => {
        state.isCreatingPartner = true;
        state.createPartnerError = null;
      })
      .addCase(addPartner.fulfilled, (state, action) => {
        state.isCreatingPartner = false;
        // Don't add to state here since we'll refetch all partners to get proper nested data
      })
      .addCase(addPartner.rejected, (state, action) => {
        state.isCreatingPartner = false;
        state.createPartnerError = action.payload;
      })

      // Delete partner
      .addCase(deletePartner.pending, (state) => {
        state.isDeletingPartner = true;
        state.deletePartnerError = null;
      })
      .addCase(deletePartner.fulfilled, (state, action) => {
        state.isDeletingPartner = false;
        state.partners = state.partners.filter(
          (partner) => partner.id !== action.meta.arg.id
        );
      })
      .addCase(deletePartner.rejected, (state, action) => {
        state.isDeletingPartner = false;
        state.deletePartnerError = action.payload;
      })

      // Edit partner
      .addCase(editPartner.pending, (state) => {
        state.isEditingPartner = true;
        state.editPartnerError = null;
      })
      .addCase(editPartner.fulfilled, (state, action) => {
        state.isEditingPartner = false;
        // Don't update state here since we'll refetch all partners to get proper nested data
      })
      .addCase(editPartner.rejected, (state, action) => {
        state.isEditingPartner = false;
        state.editPartnerError = action.payload;
      })

      // Regenerate token
      .addCase(regeneratePartnerToken.pending, (state, action) => {
        state.regeneratingTokenId = action.meta.arg.id;
        state.regenerateTokenError = null;
      })
      .addCase(regeneratePartnerToken.fulfilled, (state, action) => {
        const partnerId = action.meta.arg.id;
        const newToken = action.payload?.secretToken;
        if (newToken) {
          const partner = state.partners.find((p) => p.id === partnerId);
          if (partner) {
            partner.secretToken = newToken;
          }
        }
        state.regeneratingTokenId = null;
      })
      .addCase(regeneratePartnerToken.rejected, (state, action) => {
        state.regeneratingTokenId = null;
        state.regenerateTokenError = action.payload;
      });
  },
});

export default partnerSlice.reducer;
