import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import api from '../../api';

interface TessPredictionRecord {
  prediction_id: string;
  prediction: string;
  confidence: number;
  timestamp: string;
  user_id?: number;
}

interface GetTessPredictByIDState {
  loading: boolean;
  prediction: TessPredictionRecord | null;
  error: string | null;
}

const initialState: GetTessPredictByIDState = {
  loading: false,
  prediction: null,
  error: null,
};

export const fetchTessPredictionById = createAsyncThunk(
  'getTessPredictionById/fetchTessPredictionById',
  async (predictionId: string, { rejectWithValue }) => {
    try {
      const response = await api.get(`/tess/predictions/${predictionId}`);
      return response.data;
    } catch (error: unknown) {
      return rejectWithValue(error instanceof Error ? error.message : 'Failed to fetch TESS prediction');
    }
  }
);

const getTessPredictByIDSlice = createSlice({
  name: 'getTessPredictionById',
  initialState,
  reducers: {
    clearTessPredictionById: (state) => {
      state.prediction = null;
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchTessPredictionById.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchTessPredictionById.fulfilled, (state, action) => {
        state.loading = false;
        state.prediction = action.payload;
      })
      .addCase(fetchTessPredictionById.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      });
  },
});

export const { clearTessPredictionById } = getTessPredictByIDSlice.actions;
export default getTessPredictByIDSlice.reducer;
