import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import api from '../../api';

export interface TessPredictionParams {
  pl_orbper: number;
  pl_trandurh: number;
  pl_trandep: number;
  pl_rade: number;
  pl_insol: number;
  pl_eqt: number;
  st_teff: number;
  st_logg: number;
  st_rad: number;
}

interface TessPredictionResponse {
  prediction: string;
  confidence: number;
  prediction_id: string;
  timestamp: string;
}

interface TessPredictState {
  loading: boolean;
  prediction: TessPredictionResponse | null;
  error: string | null;
}

const initialState: TessPredictState = {
  loading: false,
  prediction: null,
  error: null,
};

export const makeTessPrediction = createAsyncThunk(
  'tessPrediction/makeTessPrediction',
  async ({ params, user_id }: { params: TessPredictionParams; user_id: number }, { rejectWithValue }) => {
    try {
      const response = await api.post(`/tess/predictions/predict?user_id=${user_id}`, { ...params });
      return response.data;
    } catch (error: unknown) {
      return rejectWithValue(error instanceof Error ? error.message : 'Failed to make TESS prediction');
    }
  }
);

const tessPredictSlice = createSlice({
  name: 'tessPrediction',
  initialState,
  reducers: {
    clearTessPrediction: (state) => {
      state.prediction = null;
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(makeTessPrediction.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(makeTessPrediction.fulfilled, (state, action) => {
        state.loading = false;
        state.prediction = action.payload;
      })
      .addCase(makeTessPrediction.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      });
  },
});

export const { clearTessPrediction } = tessPredictSlice.actions;
export default tessPredictSlice.reducer;
