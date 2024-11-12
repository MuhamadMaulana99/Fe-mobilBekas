import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
// import axios from "axios";
import axiosInstance from "../lib/axiosInstance";

// Base URL for your API
// const api = "http:localhost:3100";
// console.log(axiosInstance, 'apiii')

// Async Thunks for CRUD operations
export const fetchItems = createAsyncThunk("cars/fetchItems", async () => {
  const response = await axiosInstance.get(`/cars`);
  return response.data;
});

export const addItem = createAsyncThunk("cars/addItem", async (newItem) => {
  const response = await axiosInstance.post(`/cars`, newItem);
  return response.data;
});

export const updateItem = createAsyncThunk(
  "cars/updateItem",
  async (updatedItem) => {
    const response = await axiosInstance.put(
      `/${updatedItem.id}`,
      updatedItem
    );
    return response.data;
  }
);

export const deleteItem = createAsyncThunk("cars/deleteItem", async (id) => {
  await axiosInstance.delete(`/${id}`);
  return id;
});

// Create slice
const carSlice = createSlice({
  name: "cars",
  initialState: {
    cars: [],
    loading: false,
    error: null,
  },
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchItems.pending, (state) => {
        state.loading = true;
      })
      .addCase(fetchItems.fulfilled, (state, action) => {
        state.loading = false;
        state.items = action.payload;
      })
      .addCase(fetchItems.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message;
      })
      .addCase(addItem.fulfilled, (state, action) => {
        state.items.push(action.payload);
      })
      .addCase(updateItem.fulfilled, (state, action) => {
        const index = state.items.findIndex(
          (item) => item.id === action.payload.id
        );
        if (index !== -1) {
          state.items[index] = action.payload;
        }
      })
      .addCase(deleteItem.fulfilled, (state, action) => {
        state.items = state.items.filter((item) => item.id !== action.payload);
      });
  },
});

export default carSlice.reducer;
