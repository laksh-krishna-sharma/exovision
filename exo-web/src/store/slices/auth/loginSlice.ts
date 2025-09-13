// src/store/slices/authSlice.ts
import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import type { PayloadAction } from '@reduxjs/toolkit';
import axios, { AxiosError } from 'axios';

const baseURL = import.meta.env.VITE_API_BASE_URL;

// Define the type for auth state
interface AuthState {
  user: string[] | null;
  access_token: string | null;
  loading: boolean;
  error: string | null;
}

// Initial state
const initialState: AuthState = {
  user: null, // no user info from backend
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
      const params = new URLSearchParams();
      params.append('username', email); // FastAPI expects "username"
      params.append('password', password);

      const response = await axios.post(
        `${baseURL}/auth/login`,
        params,
        { headers: { 'Content-Type': 'application/x-www-form-urlencoded' } }
      );

      return response.data; // { access_token, token_type }
    } catch (err: unknown) {
      const errorData = (err as AxiosError)?.response?.data;
      const errorDetail = errorData && typeof errorData === 'object' && 'detail' in errorData ? (errorData as { detail?: string }).detail : undefined;
      return rejectWithValue(errorDetail || (err as Error).message);
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
      state.access_token = null;
      state.error = null;
      localStorage.removeItem('token');
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(login.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(login.fulfilled, (state, action: PayloadAction<{ access_token: string }>) => {
        state.loading = false;
        state.access_token = action.payload.access_token;
        localStorage.setItem('token', action.payload.access_token);
      })
      .addCase(login.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      });
  },
});

export const { logout } = authSlice.actions;
export default authSlice.reducer;
