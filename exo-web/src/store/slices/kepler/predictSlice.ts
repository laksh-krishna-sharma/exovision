import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import api from '../../api';

export interface PredictionParams {
  koi_fpflag_nt: number;
  koi_fpflag_ss: number;
  koi_fpflag_co: number;
  koi_fpflag_ec: number;
  koi_period: number;
  koi_period_err1: number;
  koi_period_err2: number;
  koi_time0bk: number;
  koi_time0bk_err1: number;
  koi_time0bk_err2: number;
  koi_impact: number;
  koi_impact_err1: number;
  koi_impact_err2: number;
  koi_duration: number;
  koi_duration_err1: number;
  koi_duration_err2: number;
  koi_depth: number;
  koi_depth_err1: number;
  koi_depth_err2: number;
  koi_prad: number;
  koi_prad_err1: number;
  koi_prad_err2: number;
  koi_teq: number;
  koi_teq_err1: number;
  koi_teq_err2: number;
  koi_insol: number;
  koi_insol_err1: number;
  koi_insol_err2: number;
  koi_model_snr: number;
  koi_tce_plnt_num: number;
  koi_steff: number;
  koi_steff_err1: number;
  koi_steff_err2: number;
  koi_slogg: number;
  koi_slogg_err1: number;
  koi_slogg_err2: number;
  koi_srad: number;
  koi_srad_err1: number;
  koi_srad_err2: number;
  ra: number;
  dec: number;
  koi_kepmag: number;
}

interface PredictionResponse {
  prediction: string;
  confidence: number;
  prediction_id: string;
}

interface PredictState {
  loading: boolean;
  prediction: PredictionResponse | null;
  error: string | null;
}

const initialState: PredictState = {
  loading: false,
  prediction: null,
  error: null,
};

export const makePrediction = createAsyncThunk(
  'prediction/makePrediction',
  async ({ params, user_id }: { params: PredictionParams; user_id: number }, { rejectWithValue }) => {
    try {
      const response = await api.post(`/predictions/predict?user_id=${user_id}`, { ...params });
      return response.data;
    } catch (error: unknown) {
      return rejectWithValue(error instanceof Error ? error.message : 'Failed to make prediction');
    }
  }
);

const predictSlice = createSlice({
  name: 'prediction',
  initialState,
  reducers: {
    clearPrediction: (state) => {
      state.prediction = null;
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(makePrediction.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(makePrediction.fulfilled, (state, action) => {
        state.loading = false;
        state.prediction = action.payload;
      })
      .addCase(makePrediction.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      });
  },
});

export const { clearPrediction } = predictSlice.actions;
export default predictSlice.reducer;
