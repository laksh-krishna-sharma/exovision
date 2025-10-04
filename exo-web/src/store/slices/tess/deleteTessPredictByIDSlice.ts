import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import api from '../../api';

interface DeleteTessPredictByIDState {
  loading: boolean;
  success: boolean;
  error: string | null;
}

const initialState: DeleteTessPredictByIDState = {
  loading: false,
  success: false,
  error: null,
};

export const deleteTessPredictionById = createAsyncThunk(
  'deleteTessPredictionById/deleteTessPredictionById',
  async (predictionId: string, { rejectWithValue }) => {
    try {
      const response = await api.delete(`/tess/predictions/${predictionId}`);
      return response.data;
    } catch (error: unknown) {
      return rejectWithValue(error instanceof Error ? error.message : 'Failed to delete TESS prediction');
    }
  }
);

const deleteTessPredictByIDSlice = createSlice({
  name: 'deleteTessPredictionById',
  initialState,
  reducers: {
    resetTessDeleteState: (state) => {
      state.success = false;
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(deleteTessPredictionById.pending, (state) => {
        state.loading = true;
        state.error = null;
        state.success = false;
      })
      .addCase(deleteTessPredictionById.fulfilled, (state) => {
        state.loading = false;
        state.success = true;
      })
      .addCase(deleteTessPredictionById.rejected, (state, action) => {
        state.loading = false;
        state.success = false;
        state.error = action.payload as string;
      });
  },
});

export const { resetTessDeleteState } = deleteTessPredictByIDSlice.actions;
export default deleteTessPredictByIDSlice.reducer;
