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
  async ({ user_id, skip = 0, limit = 100 }: { user_id: number; skip?: number; limit?: number }, { rejectWithValue }) => {
    try {
      console.log('Fetching Kepler predictions for user:', user_id, 'skip:', skip, 'limit:', limit);
      
      const response = await api.get(`/predictions/?user_id=${user_id}&skip=${skip}&limit=${limit}`);
      
      console.log('Fetched predictions:', response.data);
      return response.data;
    } catch (error) {
      console.error('Fetch predictions error:', error);
      
      if (error instanceof Error) {
        const axiosError = error as { response?: { data?: { detail?: string; message?: string } } };
        const errorMessage = axiosError.response?.data?.detail 
          || axiosError.response?.data?.message 
          || error.message 
          || 'Failed to fetch predictions';
        
        return rejectWithValue(errorMessage);
      }
      
      return rejectWithValue('Failed to fetch predictions');
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
