// src/store/slices/signupSlice.ts
import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import type { PayloadAction } from '@reduxjs/toolkit';
import axios, { AxiosError } from 'axios';

const DEFAULT_BASE_URL =
  typeof window !== "undefined" ? window.location.origin.replace(/\/$/, "") : "";

const baseURL = import.meta.env.VITE_API_BASE_URL ?? DEFAULT_BASE_URL;

interface User {
  id?: string;
  name?: string;
  email?: string;
  // Add other fields as needed
}

interface SignupState {
  user: User | null;
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
      console.log('Attempting signup for:', email);
      
      // Send as JSON
      const response = await axios.post(
        `${baseURL}/auth/signup`,
        { name, email, password },
        { headers: { 'Content-Type': 'application/json' } }
      );
      
      console.log('Signup response:', response.data);
      return response.data;
    } catch (err: unknown) {
      console.error("Signup error:", err);
      console.error("Signup error response:", (err as AxiosError)?.response?.data);
      
      const errorData = (err as AxiosError)?.response?.data;
      let errorMessage = 'Signup failed';
      
      if (errorData && typeof errorData === 'object') {
        if ('detail' in errorData) {
          errorMessage = (errorData as { detail: string }).detail;
        } else if ('message' in errorData) {
          errorMessage = (errorData as { message: string }).message;
        }
      } else if (err instanceof Error) {
        errorMessage = err.message;
      }
      
      return rejectWithValue(errorMessage);
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
      .addCase(signup.fulfilled, (state, action: PayloadAction<User>) => {
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
