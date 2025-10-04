// src/store/slices/authSlice.ts
import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import type { PayloadAction } from '@reduxjs/toolkit';
import axios, { AxiosError } from 'axios';

const DEFAULT_BASE_URL =
  typeof window !== "undefined" ? window.location.origin.replace(/\/$/, "") : "";

const baseURL = import.meta.env.VITE_API_BASE_URL ?? DEFAULT_BASE_URL;

// Define the type for auth state
interface AuthState {
  user: string[] | null;
  user_id: number | null;
  access_token: string | null;
  loading: boolean;
  error: string | null;
}

// Initial state
const initialState: AuthState = {
  user: null, // no user info from backend
  user_id: parseInt(localStorage.getItem('user_id') || '0') || null,
  access_token: localStorage.getItem('token'),
  loading: false,
  error: null,
};

// Async thunk for login
export const login = createAsyncThunk(
  'auth/login',
  async (
    { email, password }: { email: string; password: string },
    { rejectWithValue }
  ) => {
    try {
      console.log('Attempting login for:', email);
      
      const params = new URLSearchParams();
      params.append('username', email); // FastAPI expects "username"
      params.append('password', password);

      const response = await axios.post(
        `${baseURL}/auth/login`,
        params,
        { headers: { 'Content-Type': 'application/x-www-form-urlencoded' } }
      );

      console.log('Login response:', response.data);
      
      // Backend returns user_id as string, convert to number
      const data = {
        access_token: response.data.access_token,
        token_type: response.data.token_type,
        user_id: parseInt(response.data.user_id, 10)
      };

      return data;
    } catch (err: unknown) {
      console.error('Login error:', err);
      
      const errorData = (err as AxiosError)?.response?.data;
      const errorDetail = errorData && typeof errorData === 'object' && 'detail' in errorData ? (errorData as { detail?: string }).detail : undefined;
      
      return rejectWithValue(errorDetail || (err as Error).message || 'Login failed');
    }
  }
);

// Create slice
const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    logout: (state) => {
      state.user = null;
      state.user_id = null;
      state.access_token = null;
      state.error = null;
      localStorage.removeItem('token');
      localStorage.removeItem('user_id');
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(login.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(login.fulfilled, (state, action: PayloadAction<{ access_token: string; user_id: number }>) => {
        state.loading = false;
        state.access_token = action.payload.access_token;
        state.user_id = action.payload.user_id;
        localStorage.setItem('token', action.payload.access_token);
        localStorage.setItem('user_id', action.payload.user_id.toString());
      })
      .addCase(login.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      });
  },
});

export const { logout } = authSlice.actions;
export default authSlice.reducer;
