import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import makeRequest from "../../utils/ApiHelper";

const initialState = {
    offers: [],
    isLoadingOffers: false,

    isLoadingDeleteOffer: false,

    isCreatingOffer: false,

    isEditingOffer: false,
};

const bankSlice = createSlice({
    name: "offer",
    initialState,
    reducers: {},
    extraReducers: (builder) => {
        builder
            .addCase(getOffers.pending, (state) => {
                state.isLoadingOffers = true;
            })
            .addCase(getOffers.fulfilled, (state, action) => {
                console.log(action.payload)
                state.offers = action.payload[0];
                state.isLoadingOffers = false;
            })
            .addCase(getOffers.rejected, (state, action) => {
                state.isLoadingOffers = false;
                state.offersError = action.payload;
            })
            .addCase(deleteOffer.pending, (state) => {
                state.isLoadingDeleteOffer = true;
            })
            .addCase(deleteOffer.fulfilled, (state, action) => {
                state.isLoadingDeleteOffer = false;
                state.offers = state.offers.filter((offer) => offer.id !== action.payload);
            })
            .addCase(deleteOffer.rejected, (state, action) => {
                state.isLoadingDeleteOffer = false;
            })
            .addCase(createOffer.pending, (state) => {
                state.isCreatingOffer = true;
            })
            .addCase(createOffer.fulfilled, (state, action) => {
                state.isCreatingOffer = false;
                state.offers.push(action.payload);
            })
            .addCase(createOffer.rejected, (state, action) => {
                state.isCreatingOffer = false;
            })
            .addCase(editOffer.pending, (state) => {
                state.isEditingOffer = true;
            })
            .addCase(editOffer.fulfilled, (state, action) => {
                state.isEditingOffer = false;
                const updateoffer = action.payload;
                state.offers = state.offers.map((offer) =>
                    offer.id === updateoffer.id ? { ...offer, ...updateoffer } : offer
                );
            })
            .addCase(editOffer.rejected, (state, action) => {
                state.isEditingOffer = false;
            });
    },
});

export const getOffers = createAsyncThunk(
    "offer/getOffers",
    ({ token, logoutHandler }) =>
        makeRequest("GET", "/api/offer", {
            token,
            logoutCallback: logoutHandler,
            errorMessage: "Failed to fetch Offers",
        })
);

export const deleteOffer = createAsyncThunk(
    "offer/deleteOffer",
    ({ token, id }) => {
        makeRequest("DELETE", `/api/offer?bank_id=${id}`, {
            token,
            successMessage: "Offer deleted successfully",
            errorMessage: "Failed to delete offer",
        });
        return id;
    }
);

export const createOffer = createAsyncThunk(
    "offer/createOffer",
    ({ data, token }) =>
        makeRequest("POST", "/api/create-offer", {
            data,
            token,
            successMessage: "Offer created successfully",
            errorMessage: "Failed to create offer",
            headers: {
                "Content-Type": "multipart/form-data",
            },
        })
);

export const editOffer = createAsyncThunk(
    "offer/editOffer",
    async ({ token, payload }) =>
        makeRequest("PUT", "/api/update-offer", {
            token,
            data: payload,
            successMessage: "Offer updated successfully",
            errorMessage: "Failed while updating this offer",
        })
);

export default bankSlice.reducer;
