import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import axios from "axios";
import { BASE_URL } from "../../utils/ApiBaseUrl";
import toast from "react-hot-toast";

const initialState = {
  tickets: [],

  isCreatingTicket: false,
  createTicketError: null,

  isLoadingTickets: false,
  loadTicketsError: null,

  isDeletingTicket: false,
  deleteTicketError: null,
};

const ticketSlice = createSlice({
  name: "ticket",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(createTicket.pending, (state) => {
        state.isCreatingTicket = true;
        state.createTicketError = null;
      })
      .addCase(createTicket.fulfilled, (state, action) => {
        state.isCreatingTicket = false;
        state.tickets = [action.payload, ...state.tickets];
      })
      .addCase(createTicket.rejected, (state, action) => {
        state.isCreatingTicket = false;
        state.createTicketError = action.payload;
      })
      .addCase(getTickets.pending, (state) => {
        state.isLoadingTickets = true;
        state.loadTicketsError = null;
      })
      .addCase(getTickets.fulfilled, (state, action) => {
        state.isLoadingTickets = false;
        state.tickets = action.payload;
      })
      .addCase(getTickets.rejected, (state, action) => {
        state.isLoadingTickets = false;
        state.loadTicketsError = action.payload;
      })
      .addCase(deleteTicket.pending, (state) => {
        state.isDeletingTicket = true;
        state.deleteTicketError = null;
      })
      .addCase(deleteTicket.fulfilled, (state, action) => {
        state.isDeletingTicket = false;
        state.tickets = state.tickets.filter(
          (ticket) => ticket.id !== action.payload
        );
      })
      .addCase(deleteTicket.rejected, (state, action) => {
        state.isDeletingTicket = false;
        state.deleteTicketError = action.payload;
      });
  },
});

export const createTicket = createAsyncThunk(
  "ticket/createTicket",
  async ({ data, token }, thunkAPI) => {
    try {
      console.log(token, "token");
      const response = await axios.post(`${BASE_URL}/api/ticket`, data, {
        headers: {
          Authorization: token,
          "Content-Type": "application/json",
        },
      });

      if (response.status === 200) {
        toast.success("New Ticket Created");
        return response.data.data;
      } else {
        throw new Error("Failed to create ticket");
      }
    } catch (error) {
      const errorMessages =
        error.response?.data?.data?.errors ||
        "Failed to create ticket. Please try again.";

      if (typeof errorMessages === "object") {
        const formattedMessages = Object.values(errorMessages).join(", ");
        toast.error(formattedMessages);
        return thunkAPI.rejectWithValue(formattedMessages);
      } else {
        toast.error(errorMessages);
        return thunkAPI.rejectWithValue(errorMessages);
      }
    }
  }
);

export const getTickets = createAsyncThunk(
  "ticket/getTickets",
  async (token, thunkAPI) => {
    try {
      const response = await axios.get(`${BASE_URL}/api/ticket/company`, {
        headers: {
          Authorization: token,
        },
      });

      if (response.status === 200) {
        return response.data.data;
      } else {
        throw new Error("Failed to fetch tickets");
      }
    } catch (error) {
      const errorMessage =
        error.response?.data?.message ||
        "Failed to fetch tickets. Please try again.";
      toast.error(errorMessage);
      return thunkAPI.rejectWithValue(errorMessage);
    }
  }
);

export const deleteTicket = createAsyncThunk(
  "ticket/deleteTicket",
  async ({ id, token }, thunkAPI) => {
    try {
      const response = await axios.delete(
        `${BASE_URL}/api/ticket?ticket_id=${id}`,
        {
          headers: {
            Authorization: token,
          },
        }
      );

      if (response.status === 200) {
        toast.success("Ticket has been deleted");
        return id;
      } else {
        throw new Error("Failed to delete ticket");
      }
    } catch (error) {
      const errorMessage =
        error.response?.data?.message || "Failed while deleting this ticket.";
      toast.error(errorMessage);
      return thunkAPI.rejectWithValue(errorMessage);
    }
  }
);

export default ticketSlice.reducer;
