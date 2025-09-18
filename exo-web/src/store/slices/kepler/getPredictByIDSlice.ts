import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import api from '../../api';

interface PredictionRecord {
  prediction_id: string;
  prediction: string;
  confidence: number;
  created_at: string;
  user_id?: number;
}

interface GetPredictByIDState {
  loading: boolean;
  prediction: PredictionRecord | null;
  error: string | null;
}

const initialState: GetPredictByIDState = {
  loading: false,
  prediction: null,
  error: null,
};

export const fetchPredictionById = createAsyncThunk(
  'getPredictionById/fetchPredictionById',
  async (predictionId: string, { rejectWithValue }) => {
    try {
      const response = await api.get(`/predictions/${predictionId}`);
      return response.data;
    } catch (error: unknown) {
      return rejectWithValue(error instanceof Error ? error.message : 'Failed to fetch prediction');
    }
  }
);

const getPredictByIDSlice = createSlice({
  name: 'getPredictionById',
  initialState,
  reducers: {
    clearPredictionById: (state) => {
      state.prediction = null;
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchPredictionById.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchPredictionById.fulfilled, (state, action) => {
        state.loading = false;
        state.prediction = action.payload;
      })
      .addCase(fetchPredictionById.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      });
  },
});

export const { clearPredictionById } = getPredictByIDSlice.actions;
export default getPredictByIDSlice.reducer;
