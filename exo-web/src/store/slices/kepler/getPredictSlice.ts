import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import api from '../../api';

interface PredictionRecord {
  prediction_id: string;
  prediction: string;
  confidence: number;
  created_at: string;
  user_id?: number;
}

interface GetPredictState {
  loading: boolean;
  predictions: PredictionRecord[];
  total: number;
  error: string | null;
}

const initialState: GetPredictState = {
  loading: false,
  predictions: [],
  total: 0,
  error: null,
};

export const fetchPredictions = createAsyncThunk(
  'getPrediction/fetchPredictions',
  async ({ skip = 0, limit = 100 }: { skip?: number; limit?: number } = {}, { rejectWithValue }) => {
    try {
      const response = await api.get(`/predictions/?skip=${skip}&limit=${limit}`);
      return response.data;
    } catch (error: unknown) {
      return rejectWithValue(error instanceof Error ? error.message : 'Failed to fetch predictions');
    }
  }
);

const getPredictSlice = createSlice({
  name: 'getPrediction',
  initialState,
  reducers: {
    clearPredictions: (state) => {
      state.predictions = [];
      state.total = 0;
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchPredictions.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchPredictions.fulfilled, (state, action) => {
        state.loading = false;
        state.predictions = action.payload.predictions;
        state.total = action.payload.total;
      })
      .addCase(fetchPredictions.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      });
  },
});

export const { clearPredictions } = getPredictSlice.actions;
export default getPredictSlice.reducer;
