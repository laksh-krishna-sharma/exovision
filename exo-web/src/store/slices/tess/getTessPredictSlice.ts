import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import api from '../../api';

interface TessPredictionRecord {
  prediction_id: string;
  prediction: string;
  confidence: number;
  timestamp: string;
  user_id?: number;
}

interface GetTessPredictState {
  loading: boolean;
  predictions: TessPredictionRecord[];
  total: number;
  error: string | null;
}

const initialState: GetTessPredictState = {
  loading: false,
  predictions: [],
  total: 0,
  error: null,
};

export const fetchTessPredictions = createAsyncThunk(
  'getTessPrediction/fetchTessPredictions',
  async ({ user_id, skip = 0, limit = 100 }: { user_id: number; skip?: number; limit?: number }, { rejectWithValue }) => {
    try {
      console.log('Fetching TESS predictions for user:', user_id, 'skip:', skip, 'limit:', limit);
      
      const response = await api.get(`/tess/predictions/?user_id=${user_id}&skip=${skip}&limit=${limit}`);
      
      console.log('Fetched TESS predictions:', response.data);
      return response.data;
    } catch (error) {
      console.error('Fetch TESS predictions error:', error);
      
      if (error instanceof Error) {
        const axiosError = error as { response?: { data?: { detail?: string; message?: string } } };
        const errorMessage = axiosError.response?.data?.detail 
          || axiosError.response?.data?.message 
          || error.message 
          || 'Failed to fetch TESS predictions';
        
        return rejectWithValue(errorMessage);
      }
      
      return rejectWithValue('Failed to fetch TESS predictions');
    }
  }
);

const getTessPredictSlice = createSlice({
  name: 'getTessPrediction',
  initialState,
  reducers: {
    clearTessPredictions: (state) => {
      state.predictions = [];
      state.total = 0;
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchTessPredictions.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchTessPredictions.fulfilled, (state, action) => {
        state.loading = false;
        state.predictions = action.payload.predictions;
        state.total = action.payload.total;
      })
      .addCase(fetchTessPredictions.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      });
  },
});

export const { clearTessPredictions } = getTessPredictSlice.actions;
export default getTessPredictSlice.reducer;
