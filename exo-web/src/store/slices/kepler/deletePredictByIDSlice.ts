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
      console.log('Deleting Kepler prediction:', predictionId);
      
      const response = await api.delete(`/predictions/${predictionId}`);
      
      console.log('Delete prediction response:', response.data);
      return response.data;
    } catch (error) {
      console.error('Delete prediction error:', error);
      
      if (error instanceof Error) {
        const axiosError = error as { response?: { data?: { detail?: string; message?: string } } };
        const errorMessage = axiosError.response?.data?.detail 
          || axiosError.response?.data?.message 
          || error.message 
          || 'Failed to delete prediction';
        
        return rejectWithValue(errorMessage);
      }
      
      return rejectWithValue('Failed to delete prediction');
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
