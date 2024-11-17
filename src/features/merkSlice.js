import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axiosInstance from "../lib/axiosInstance";

// Async Thunks for CRUD operations with try-catch for error handling
export const fetchMerk = createAsyncThunk("merk/fetchMerk", async (_, { rejectWithValue }) => {
  try {
    const response = await axiosInstance.get(`/merk`);
    return response?.data || [];
  } catch (error) {
    console.error("Error fetching merk:", error);
    return rejectWithValue(error.response?.data || error.message);
  }
});

export const addMerk = createAsyncThunk("merk/addMerk", async (newItem, { rejectWithValue }) => {
  try {
    const response = await axiosInstance.post(`/merk`, newItem);
    return response?.data;
  } catch (error) {
    console.error("Error adding merk:", error);
    return rejectWithValue(error.response?.data || error.message);
  }
});

export const updateMerk = createAsyncThunk("merk/updateMerk", async (formData, { rejectWithValue }) => {
  try {
    // console.log(formData, 'formDataformData')
    const body = {
      merk: formData?.merk,
    };
    const response = await axiosInstance.put(`/merk/${formData?.id}`, body);
    return response?.data;
  } catch (error) {
    console.error("Error updating merk:", error);
    return rejectWithValue(error.response?.data || error.message);
  }
});

export const deleteMerk = createAsyncThunk("merk/deleteMerk", async (id, { rejectWithValue }) => {
  try {
    await axiosInstance.delete(`/merk/${id}`);
    return id;
  } catch (error) {
    console.error("Error deleting merk:", error);
    return rejectWithValue(error.response?.data || error.message);
  }
});

// Create slice
const merkSlice = createSlice({
  name: "merk",
  initialState: {
    items: [],
    loading: false,
    error: null,
  },
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchMerk.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchMerk.fulfilled, (state, action) => {
        state.loading = false;
        state.items = action.payload || [];
      })
      .addCase(fetchMerk.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      .addCase(addMerk.fulfilled, (state, action) => {
        if (action.payload) state.items.push(action.payload);
      })
      .addCase(addMerk.rejected, (state, action) => {
        state.error = action.payload;
      })
      .addCase(updateMerk.fulfilled, (state, action) => {
        if (action.payload) {
          const index = state.items.findIndex((item) => item.id === action.payload.id);
          if (index !== -1) {
            state.items[index] = action.payload;
          }
        }
      })
      .addCase(updateMerk.rejected, (state, action) => {
        state.error = action.payload;
      })
      .addCase(deleteMerk.fulfilled, (state, action) => {
        state.items = state.items.filter((item) => item.id !== action.payload);
      })
      .addCase(deleteMerk.rejected, (state, action) => {
        state.error = action.payload;
      });
  },
});

export default merkSlice.reducer;
