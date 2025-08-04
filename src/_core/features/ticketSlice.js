// src/store/slices/ticketSlice.ts

import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import makeRequest from "../../utils/ApiHelper";

const initialState = {
  tickets: [],

  isCreatingTicket: false,
  createTicketError: null,

  isLoadingTickets: false,
  loadTicketsError: null,

  isUpdatingTicket: false,
  updateTicketError: null,

  isDeletingTicket: false,
  deleteTicketError: null,
};

export const createTicket = createAsyncThunk(
  "ticket/createTicket",
  ({ data, token }) =>
    makeRequest("post", "/api/ticket", {
      data,
      token,
      successMessage: "New Ticket Created",
      errorMessage: "Failed to create ticket",
    })
);

export const getTickets = createAsyncThunk(
  "ticket/getTickets",
  ({ token, logoutHandler }) =>
    makeRequest("get", "/api/ticket/all", {
      token,
      logoutCallback: logoutHandler,
      errorMessage: "Failed to fetch tickets",
    })
);

export const editTicket = createAsyncThunk(
  "ticket/editTicket",
  ({ data, token }) =>
    makeRequest("put", "/api/ticket", {
      data,
      token,
      successMessage: "Ticket updated successfully",
      errorMessage: "Failed while updating this ticket",
    })
);

export const deleteTicket = createAsyncThunk(
  "ticket/deleteTicket",
  ({ id, token }) =>
    makeRequest("delete", `/api/ticket?ticket_id=${id}`, {
      token,
      successMessage: "Ticket has been deleted",
      errorMessage: "Failed while deleting this ticket",
    })
);

const ticketSlice = createSlice({
  name: "ticket",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      // CREATE
      .addCase(createTicket.pending, (s) => {
        s.isCreatingTicket = true;
        s.createTicketError = null;
      })
      .addCase(createTicket.fulfilled, (s, { payload }) => {
        s.isCreatingTicket = false;
        s.tickets.unshift(payload);
      })
      .addCase(createTicket.rejected, (s, { payload }) => {
        s.isCreatingTicket = false;
        s.createTicketError = payload;
      })

      // READ
      .addCase(getTickets.pending, (s) => {
        s.isLoadingTickets = true;
        s.loadTicketsError = null;
      })
      .addCase(getTickets.fulfilled, (s, { payload }) => {
        s.isLoadingTickets = false;
        s.tickets = payload;
      })
      .addCase(getTickets.rejected, (s, { payload }) => {
        s.isLoadingTickets = false;
        s.loadTicketsError = payload;
      })

      // UPDATE
      .addCase(editTicket.pending, (s) => {
        s.isUpdatingTicket = true;
        s.updateTicketError = null;
      })
      .addCase(editTicket.fulfilled, (s, { payload }) => {
        s.isUpdatingTicket = false;
        s.tickets = s.tickets.map((t) =>
          t.id === payload.id ? payload : t
        );
      })
      .addCase(editTicket.rejected, (s, { payload }) => {
        s.isUpdatingTicket = false;
        s.updateTicketError = payload;
      })

      // DELETE
      .addCase(deleteTicket.pending, (s) => {
        s.isDeletingTicket = true;
        s.deleteTicketError = null;
      })
      .addCase(deleteTicket.fulfilled, (s, { payload }) => {
        s.isDeletingTicket = false;
        s.tickets = s.tickets.filter((t) => t.id !== payload);
      })
      .addCase(deleteTicket.rejected, (s, { payload }) => {
        s.isDeletingTicket = false;
        s.deleteTicketError = payload;
      });
  },
});

export default ticketSlice.reducer;
