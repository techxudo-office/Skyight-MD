import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import axios from "axios";
import { BASE_URL } from "../../utils/ApiBaseUrl";
import toast from "react-hot-toast";

const initialState = {
    isSettingLoading: false,
    errorSetting: null,
    settingData: null,
    isUpdatingSetting: false,
    updateError: null,
};

const settingSlice = createSlice({
    name: "setting",
    initialState,
    reducers: {},
    extraReducers: (builder) => {
        builder
            .addCase(getSetting.pending, (state) => {
                state.isSettingLoading = true;
                state.errorSetting = null;
            })
            .addCase(getSetting.fulfilled, (state, action) => {
                state.isSettingLoading = false;
                state.settingData = action.payload;
            })
            .addCase(getSetting.rejected, (state, action) => {
                state.isSettingLoading = false;
                state.errorSetting = action.payload;
            })
            .addCase(updateSetting.pending, (state) => {
                state.isUpdatingSetting = true;
                state.updateError = null;
            })
            .addCase(updateSetting.fulfilled, (state, action) => {
                state.isUpdatingSetting = false;
                toast.success("Setting Updated Successfully");
            })
            .addCase(updateSetting.rejected, (state, action) => {
                state.isUpdatingSetting = false;
                state.updateError = action.payload;
                toast.error(action.payload);
            });
    }
});

export const getSetting = createAsyncThunk(
    "setting/getSetting",
    async (token, thunkAPI) => {
        try {
            const response = await axios.get(`${BASE_URL}/api/setting`, {
                headers: {
                    Authorization: token,
                }
            });
            if (response.status === 200) {
                return response.data.data;
            } else {
                throw new Error("Failed to fetch settings");
            }
        } catch (error) {
            const errorMessage =
                error.response?.data?.message || "Failed to fetch settings. Please try again.";
            toast.error(errorMessage);
            return thunkAPI.rejectWithValue(errorMessage);
        }
    }
);

export const updateSetting = createAsyncThunk(
    "setting/updateSetting",
    async ({ payload, token }, thunkAPI) => {
        try {
            const response = await axios.post(`${BASE_URL}/api/setting`, payload, {
                headers: {
                    Authorization: token,
                    Accept: "application/json"
                }
            });

            if (response.status === 200) {
                return response.data.message;
            } else {
                throw new Error("Failed to update settings");
            }
        } catch (error) {
            let errorMessage = "Failed to update settings. Please try again.";
            if (error.response) {
                errorMessage =
                    error.response.data?.data?.errors?.commission ||
                    error.response.data?.data?.errors?.rate ||
                    errorMessage;
            }
            toast.error(errorMessage);
            return thunkAPI.rejectWithValue(errorMessage);
        }
    }
);

export default settingSlice.reducer;
