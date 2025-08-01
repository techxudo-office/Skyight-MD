import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import makeRequest from "../../utils/ApiHelper";

const initialState = {
    customers: [],
    isLoadingCustomers: false,

    isDeletingCustomer: false,

    isCreatingOffer: false,

    isEditingCustomer: false,
};

const customerSlice = createSlice({
    name: "customer",
    initialState,
    reducers: {},
    extraReducers: (builder) => {
        builder
            .addCase(getCustomers.pending, (state) => {
                state.isLoadingCustomers = true;
            })
            .addCase(getCustomers.fulfilled, (state, action) => {
                console.log(action.payload)
                state.customers = action.payload[0];
                state.isLoadingCustomers = false;
            })
            .addCase(getCustomers.rejected, (state, action) => {
                state.isLoadingCustomers = false;
            })
            .addCase(deleteCustomer.pending, (state) => {
                state.isDeletingCustomer = true;
            })
            .addCase(deleteCustomer.fulfilled, (state, action) => {
                state.isDeletingCustomer = false;
                state.customers = state.customers.filter((offer) => offer.id !== action.payload);
            })
            .addCase(deleteCustomer.rejected, (state, action) => {
                state.isDeletingCustomer = false;
            })
            .addCase(createOffer.pending, (state) => {
                state.isCreatingOffer = true;
            })
            .addCase(createOffer.fulfilled, (state, action) => {
                state.isCreatingOffer = false;
                state.customers.push(action.payload);
            })
            .addCase(createOffer.rejected, (state, action) => {
                state.isCreatingOffer = false;
            })
            .addCase(editOffer.pending, (state) => {
                state.isEditingCustomer = true;
            })
            .addCase(editOffer.fulfilled, (state, action) => {
                state.isEditingCustomer = false;
                const updateoffer = action.payload;
                state.customers = state.customers.map((offer) =>
                    offer.id === updateoffer.id ? { ...offer, ...updateoffer } : offer
                );
            })
            .addCase(editOffer.rejected, (state, action) => {
                state.isEditingCustomer = false;
            });
    },
});

export const getCustomers = createAsyncThunk(
    "customer/getCustomers",
    ({ token, logoutHandler }) =>
        makeRequest("GET", "/api/allCustomers", {
            token,
            logoutCallback: logoutHandler,
            errorMessage: "Failed to fetch Customers",
        })
);

export const deleteCustomer = createAsyncThunk(
    "customer/deleteCustomer",
    ({ token, id }) => {
        makeRequest("DELETE", `/api/customer/${id}`, {
            token,
            successMessage: "Customer deleted successfully",
            errorMessage: "Failed to delete customer",
        });
        return id;
    }
);

export const createOffer = createAsyncThunk(
    "customer/createOffer",
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
    "customer/editOffer",
    async ({ token, payload }) =>
        makeRequest("PUT", "/api/update-offer", {
            token,
            data: payload,
            successMessage: "Offer updated successfully",
            errorMessage: "Failed while updating this offer",
        })
);

export default customerSlice.reducer;
