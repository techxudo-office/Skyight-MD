import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import makeRequest from "./ApiHelper";

const initialState = {
    adminData: null,
    isLoading: false,
}

const persistSlice = createSlice({
    name: "persist",
    initialState,
    reducers: {
        updateAdminData: (state, action) => {
            state.adminData = action.payload;
        },
    },
    extraReducers: (builder) => {
        builder
            .addCase(login.pending, (state) => {
                state.isLoading = true;
            })
            .addCase(login.fulfilled, (state, action) => {
                state.isLoading = false;
                state.adminData = action.payload;
                if (action.payload?.token) {
                    localStorage.setItem("auth_token", action.payload.token);
                }
            })
            .addCase(login.rejected, (state, action) => {
                state.isLoading = false;
            })
    },
});

export const login = createAsyncThunk(
    "auth/login",
    async (payload) => {
        const response = await makeRequest(
            'POST',
            '/api/login',
            {
                data: payload,
                successMessage: "Login successful",
                errorMessage: "Login failed. Please try again.",
                headers: {
                    Accept: "application/json",
                    "Content-Type": "application/json"
                }
            }
        );
        return response.data?.data;
    }
);
export default persistSlice.reducer;