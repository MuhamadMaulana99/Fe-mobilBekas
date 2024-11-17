import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axiosInstance from "../lib/axiosInstance";

// Async Thunk untuk proses login
export const loginUser = createAsyncThunk(
  "login/loginUser",
  async (credentials, { rejectWithValue }) => {
    try {
      const response = await axiosInstance.post(`/login`, credentials);
      const data = response?.data;

      // Simpan token atau data ke localStorage jika login berhasil
      if (data?.token) {
        localStorage.setItem("userToken", data.token);
        localStorage.setItem("userRole", data.role || "user"); // Menyimpan role jika ada
      }
      return data;
    } catch (error) {
      console.error("Error logging in:", error);
      return rejectWithValue(error.response?.data || "Invalid username or password");
    }
  }
);

// Slice untuk login
const loginSlice = createSlice({
  name: "login",
  initialState: {
    isAuthenticated: false,
    loading: false,
    user: null,
    error: null,
  },
  reducers: {
    logoutUser: (state) => {
      // Hapus token dan role dari localStorage saat logout
      localStorage.removeItem("userToken");
      localStorage.removeItem("userRole");
      state.isAuthenticated = false;
      state.user = null;
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(loginUser.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(loginUser.fulfilled, (state, action) => {
        state.loading = false;
        if (action.payload?.token) {
          state.isAuthenticated = true;
          state.user = action.payload; // Menyimpan data pengguna jika diperlukan
        } else {
          state.error = "Login failed";
        }
      })
      .addCase(loginUser.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
  },
});

export const { logoutUser } = loginSlice.actions;

export default loginSlice.reducer;
