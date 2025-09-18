import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import api from '../../api';

interface DeletePredictByIDState {
  loading: boolean;
  success: boolean;
  error: string | null;
}

const initialState: DeletePredictByIDState = {
  loading: false,
  success: false,
  error: null,
};

export const deletePredictionById = createAsyncThunk(
  'deletePredictionById/deletePredictionById',
  async (predictionId: string, { rejectWithValue }) => {
    try {
      const response = await api.delete(`/predictions/${predictionId}`);
      return response.data;
    } catch (error: unknown) {
      return rejectWithValue(error instanceof Error ? error.message : 'Failed to delete prediction');
    }
  }
);

const deletePredictByIDSlice = createSlice({
  name: 'deletePredictionById',
  initialState,
  reducers: {
    resetDeleteState: (state) => {
      state.success = false;
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(deletePredictionById.pending, (state) => {
        state.loading = true;
        state.error = null;
        state.success = false;
      })
      .addCase(deletePredictionById.fulfilled, (state) => {
        state.loading = false;
        state.success = true;
      })
      .addCase(deletePredictionById.rejected, (state, action) => {
        state.loading = false;
        state.success = false;
        state.error = action.payload as string;
      });
  },
});

export const { resetDeleteState } = deletePredictByIDSlice.actions;
export default deletePredictByIDSlice.reducer;
