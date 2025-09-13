// src/store/slices/signupSlice.ts
import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import type { PayloadAction } from '@reduxjs/toolkit';
import axios from 'axios';

const baseURL = import.meta.env.VITE_API_BASE_URL;

interface SignupState {
  user: any | null;
  loading: boolean;
  error: string | null;
}

const initialState: SignupState = {
  user: null,
  loading: false,
  error: null,
};

// Async thunk for signup
export const signup = createAsyncThunk(
  'auth/signup',
  async (
    { name, email, password }: { name: string; email: string; password: string },
    { rejectWithValue }
  ) => {
    try {
      // Send as JSON
      const response = await axios.post(
        `${baseURL}/auth/signup`,
        { name, email, password },
        { headers: { 'Content-Type': 'application/json' } }
      );
      return response.data;
    } catch (err: any) {
      console.error("Signup error:", err.response?.data);
      console.error("Full error:", err);
      return rejectWithValue(err.response?.data || err.message);
    }
  }
);

const signupSlice = createSlice({
  name: 'signup',
  initialState,
  reducers: {
    resetSignup: (state) => {
      state.user = null;
      state.loading = false;
      state.error = null;
      localStorage.removeItem('user');
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(signup.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(signup.fulfilled, (state, action: PayloadAction<any>) => {
        state.loading = false;
        state.user = action.payload;
        localStorage.setItem('user', JSON.stringify(action.payload));
      })
      .addCase(signup.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      });
  },
});

export const { resetSignup } = signupSlice.actions;
export default signupSlice.reducer;
