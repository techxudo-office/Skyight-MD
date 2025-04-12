import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import axios from "axios";
import { BASE_URL } from "../../utils/ApiBaseUrl";
import toast from "react-hot-toast";

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
  async (token, thunkAPI) => {
    try {
      const response = await axios.get(`${BASE_URL}/api/reason`, {
        headers: {
          Authorization: token,
        },
      });

      if (response.status === 200) {
        if (response.data.data.length > 0) {
          return response.data.data;
        }
      }
    } catch (error) {
      const errorMessage =
        error?.response?.data?.message || "Failed to fetch Reasons.";
      toast.error(errorMessage);
      return thunkAPI.rejectWithValue(errorMessage);
    }
  }
);
export const deleteReason = createAsyncThunk(
  "reason/deleteReason",
  async ({ token, id }, thunkAPI) => {
    try {
      const response = await axios.delete(`${BASE_URL}/api/reason/${id}`, {
        headers: {
          Authorization: token,
        },
      });

      if (response.status === 200) {
        toast.success("Reason deleted successfully");
        return id;
      }
    } catch (error) {
      const errorMessage =
        error?.response?.data?.message || "Failed to delete Reason.";
      toast.error(errorMessage);
      return thunkAPI.rejectWithValue(errorMessage);
    }
  }
);

export const createReason = createAsyncThunk(
  "reason/createReason",
  async ({ data, token }, thunkAPI) => {
    try {
      const response = await axios.post(`${BASE_URL}/api/reason`, data, {
        headers: {
          Authorization: token,
          "Content-Type": "application/json",
        },
      });
      toast.success("Reason created successfully");
      return response.data.data;
    } catch (error) {
      console.log(error);
      const errorMessage =
        error.response?.data?.message || "Failed to create reason.";
      toast.error(errorMessage);
      return thunkAPI.rejectWithValue(errorMessage);
    }
  }
);

export const editReason = createAsyncThunk(
  "reason/editReason",
  async ({ id, token, data }, thunkAPI) => {
    const payload = {
      reason_id: id,
      reason: data,
    };
    try {
      console.log(data, "data");
      const response = await axios.put(
        `${BASE_URL}/api/reason/${id}`,
        payload,
        {
          headers: {
            Authorization: token,
          },
        }
      );

      if (response.status === 200) {
        toast.success("reason updated successfully");
        return response.data.data;
      }
    } catch (error) {
      const errorMessage =
        error?.response?.data?.message || "Failed while updating this reason";
      toast.error(errorMessage);
      return thunkAPI.rejectWithValue(errorMessage);
    }
  }
);

export default reasonsSlice.reducer;
