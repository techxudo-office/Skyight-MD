import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import axios from "axios";
import { BASE_URL } from "../../utils/ApiBaseUrl";
import toast from "react-hot-toast";

const initialState = {
    reasons: [],
    isLoadingReasons: false,
    reasonsError: null,
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
    },
});

export const getReasons = createAsyncThunk(
    "company/getReasons",
    async (token, thunkAPI) => {
        try {
            const response = await axios.get(`${BASE_URL}/api/reason`, {
                headers: {
                    Authorization: token,
                },
            });

            if (response.status === 200) {
                if (response.data.data.length > 0) {
                    const extractedData = response.data.data.map(
                        ({ id, reason, status }) => ({ id, reason, status })
                    );
                    return { status: true, data: extractedData };
                }
            }
        } catch (error) {
            const errorMessage =
                error?.response?.data?.message || "Failed to fetch companies.";
            toast.error(errorMessage);
            return thunkAPI.rejectWithValue(errorMessage);
        }
    }
);




export default reasonsSlice.reducer;
