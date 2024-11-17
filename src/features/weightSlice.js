import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
// import axios from "axios";
import moment from "moment";
import axiosInstancePrivate from "../lib/axiosInstancePrivate";

// Base URL for your API
// const api = "http:localhost:3100";
// console.log(axiosInstancePrivate, 'apiii')

// Async Thunks for CRUD operations
// const token = localStorage.getItem("userToken");
export const fetchItemWeight = createAsyncThunk("cars/fetchItemWeight", async () => {
  const response = await axiosInstancePrivate.get(`/api/weight`);
  return response.data;
});

export const addItemWeight = createAsyncThunk("cars/addItemWeight", async (newItem) => {
  const response = await axiosInstancePrivate.post(`/api/weight`, newItem);
  return response.data;
});

export const updateItemWeight = createAsyncThunk(
  "cars/updateItemWeight",
  async (formData) => {
    // console.log(formData, "idd");


    const response = await axiosInstancePrivate.put(`/api/weight/${formData?.id}`, formData?.payload);
    return response.data;
  }
);

export const deleteItemWeight = createAsyncThunk("cars/deleteItemWeight", async (id) => {
  await axiosInstancePrivate.delete(`/api/weight/${id}`);
  return id;
});

// Create slice
const weightSlice = createSlice({
  name: "weight",
  initialState: {
    weight: [],
    loading: false,
    error: null,
  },
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchItemWeight.pending, (state) => {
        state.loading = true;
      })
      .addCase(fetchItemWeight.fulfilled, (state, action) => {
        state.loading = false;
        state.items = action.payload;
      })
      .addCase(fetchItemWeight.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message;
      })
      .addCase(addItemWeight.fulfilled, (state, action) => {
        state.items.push(action.payload);
      })
      .addCase(updateItemWeight.fulfilled, (state, action) => {
        const index = state.items.findIndex(
          (item) => item.id === action.payload.id
        );
        if (index !== -1) {
          state.items[index] = action.payload;
        }
      })
      .addCase(deleteItemWeight.fulfilled, (state, action) => {
        state.items = state.items.filter((item) => item.id !== action.payload);
      });
  },
});

export default weightSlice.reducer;
