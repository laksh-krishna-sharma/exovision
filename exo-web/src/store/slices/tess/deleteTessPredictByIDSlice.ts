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
      console.log('Deleting TESS prediction:', predictionId);
      
      const response = await api.delete(`/tess/predictions/${predictionId}`);
      
      console.log('Delete TESS prediction response:', response.data);
      return response.data;
    } catch (error) {
      console.error('Delete TESS prediction error:', error);
      
      if (error instanceof Error) {
        const axiosError = error as { response?: { data?: { detail?: string; message?: string } } };
        const errorMessage = axiosError.response?.data?.detail 
          || axiosError.response?.data?.message 
          || error.message 
          || 'Failed to delete TESS prediction';
        
        return rejectWithValue(errorMessage);
      }
      
      return rejectWithValue('Failed to delete TESS prediction');
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
