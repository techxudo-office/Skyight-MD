import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import axios from "axios";
import { BASE_URL } from "../../utils/ApiBaseUrl";
import toast from "react-hot-toast";

const initialState = {
    isSearchHistoryLoading: false,
    errorSearchHistory: null,
    SearchHistory: []
};

const historySlice = createSlice({
    name: "history",
    initialState,
    reducers: {},
    extraReducers: (builder) => {
        builder
            .addCase(getSearchHistory.pending, (state) => {
                state.isSearchHistoryLoading = true;
                state.errorSearchHistory = null;
            })
            .addCase(getSearchHistory.fulfilled, (state, action) => {
                state.isSearchHistoryLoading = false;
                state.SearchHistory = action.payload;
            })
            .addCase(getSearchHistory.rejected, (state, action) => {
                state.isSearchHistoryLoading = false;
                state.errorSearchHistory = action.payload;
            });
    }
});


export const getSearchHistory = createAsyncThunk(
    "history/SearchHistory",
    async (token, thunkAPI) => {
        try {
            const response = await axios.get(`${BASE_URL}/api/searchhistory`, {
                headers: {
                    Authorization: token,
                    Accept: "application/json"
                }
            });

            if (response.status === 200) {
                console.log("searchHistory", response.data?.data || response.data);
                return response.data?.data || response.data;
            } else {
                throw new Error("Failed to fetch search history");
            }
        } catch (error) {
            const errorMessage =
                error.response?.data?.message ||
                "Failed to fetch search history. Please try again.";
            toast.error(errorMessage);
            return thunkAPI.rejectWithValue(errorMessage);
        }
    }
);

export default historySlice.reducer;
