import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import axios from "axios";
import { BASE_URL } from "../../utils/ApiBaseUrl";
import toast from "react-hot-toast";

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
      .addCase(createcommision.pending, (state) => {
        state.isCreatingcommision = true;
        state.createcommisionError = null;
      })
      .addCase(createcommision.fulfilled, (state, action) => {
        state.isCreatingcommision = false;
        state.commisions = [action.payload, ...state.commisions];
      })
      .addCase(createcommision.rejected, (state, action) => {
        state.isCreatingcommision = false;
        state.createcommisionError = action.payload;
      })
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
        const commision = action.payload;
        console.log(commision);
        state.commisions = state.commisions.map((tran) =>
          tran.id === commision.id ? { ...tran, ...commision } : tran
        );
      })
      .addCase(editcommision.rejected, (state, action) => {
        state.isEditingcommision = false;
        state.editcommisionError = action.payload;
      });
  },
});

export const createcommision = createAsyncThunk(
  "commision/createcommision",
  async ({ data, token }, thunkAPI) => {
    try {
      const response = await axios.post(
        `${BASE_URL}/api/company/create-commision`,
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
        toast.success("commision created successfully!");
        return response.data;
      }
    } catch (error) {
      const errorMessage =
        error?.response?.data?.message || "Failed to create commision";
      toast.error(errorMessage);
      return thunkAPI.rejectWithValue(errorMessage);
    }
  }
);

export const getCommision = createAsyncThunk(
  "commision/getCommision",
  async (token, thunkAPI) => {
    try {
      const response = await axios.get(
        `${BASE_URL}/api/fetch-commission`,
        {
          headers: {
            Authorization: token,
          },
        }
      );
      return response.data.data;
    } catch (error) {
      const errorMessage =
        error?.response?.data?.message || "Failed to fetch commisions";
      toast.error(errorMessage);
      return thunkAPI.rejectWithValue(errorMessage);
    }
  }
);

export const editcommision = createAsyncThunk(
  "commision/editcommision",
  async ({ token, data }, thunkAPI) => {
    try {
      console.log(data, "data");
      const response = await axios.put(
        `${BASE_URL}/api/company/update-commision`,
        data,
        {
          headers: {
            Authorization: token,
          },
        }
      );

      if (response.status === 200) {
        toast.success("commision updated successfully");
        return response.data.data;
      }
    } catch (error) {
      const errorMessage =
        error?.response?.data?.message ||
        "Failed while updating this commision";
      toast.error(errorMessage);
      return thunkAPI.rejectWithValue(errorMessage);
    }
  }
);

export default commisionSlice.reducer;
