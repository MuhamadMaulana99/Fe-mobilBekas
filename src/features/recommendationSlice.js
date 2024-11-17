import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
// import axios from "axios";
import moment from "moment";
import axiosInstancePrivate from "../lib/axiosInstancePrivate";

// Base URL for your API
// const api = "http:localhost:3100";
// console.log(axiosInstancePrivate, 'apiii')

// Async Thunks for CRUD operations
// const token = localStorage.getItem("userToken");
export const fetchitemRecommendations = createAsyncThunk("recomendations/fetchitemRecommendations", async () => {
  const response = await axiosInstancePrivate.get(`/api/recommendations`);
  return response.data;
});

export const additemRecommendations = createAsyncThunk("recomendations/additemRecommendations", async (newItem) => {
  console.log(newItem, 'item')
  const response = await axiosInstancePrivate.post(`/api/recommendations`, newItem);
  return response.data;
});

export const updateitemRecommendations = createAsyncThunk(
  "recomendations/updateitemRecommendations",
  async (formData) => {
    // console.log(formData, "idd");


    const response = await axiosInstancePrivate.put(`/api/recommendations/${formData?.id}`, formData?.payload);
    return response.data;
  }
);

export const deleteitemRecommendations = createAsyncThunk("recomendations/deleteitemRecommendations", async (id) => {
  await axiosInstancePrivate.delete(`/api/recommendations/${id}`);
  return id;
});

// Create slice
const recommendationSlice = createSlice({
  name: "recomendations",
  initialState: {
    items: [],
    loading: false,
    error: null,
  },
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchitemRecommendations.pending, (state) => {
        state.loading = true;
      })
      .addCase(fetchitemRecommendations.fulfilled, (state, action) => {
        state.loading = false;
        state.items = action.payload;
      })
      .addCase(fetchitemRecommendations.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message;
      })
      .addCase(additemRecommendations.fulfilled, (state, action) => {
        state.items.push(action.payload);
      })
      .addCase(updateitemRecommendations.fulfilled, (state, action) => {
        const index = state.items.findIndex(
          (item) => item.id === action.payload.id
        );
        if (index !== -1) {
          state.items[index] = action.payload;
        }
      })
      .addCase(deleteitemRecommendations.fulfilled, (state, action) => {
        state.items = state.items.filter((item) => item.id !== action.payload);
      });
  },
});

export default recommendationSlice.reducer;
