import { useState, useEffect } from 'react';
import { useSelector } from 'react-redux';
import { toast } from 'react-toastify';
import ModelSelectButton from '@/components/prediction/ModelSelectButton';
import ParametersCard from '@/components/prediction/ParametersCard';
import PredictionsTable from '@/components/prediction/PredictionsTable';
import type { Param, PredictionRow } from '@/components/prediction/Types';
import { makePrediction, clearPrediction, type PredictionParams } from '@/store/slices/kepler/predictSlice';
import { fetchPredictions } from '@/store/slices/kepler/getPredictSlice';
import { deletePredictionById, resetDeleteState } from '@/store/slices/kepler/deletePredictByIDSlice';
import type { RootState } from '@/store';
import { useAppDispatch } from '@/store';
import { defaultPrimaryParams, defaultExtraParams } from '@/staticValues/kepler_static_values';

const PredictionPage: React.FC = () => {
  const dispatch = useAppDispatch();
  const [selectedModel, setSelectedModel] = useState('kepler_ann');

  // Initialize parameters with default values from static file
  const [primaryParams, setPrimaryParams] = useState<Param[]>(defaultPrimaryParams);
  const [extraParams, setExtraParams] = useState<Param[]>(defaultExtraParams);

  // Redux state selectors
  const { loading: predictLoading, prediction, error: predictError } = useSelector(
    (state: RootState) => state.keplerPredictionData
  );
  const { loading: fetchLoading, predictions: reduxPredictions } = useSelector(
    (state: RootState) => state.keplerGetPredictionData
  );
  const { loading: deleteLoading, success: deleteSuccess, error: deleteError } = useSelector(
    (state: RootState) => state.deletePredictByIdData
  );

  // Load predictions on component mount
  useEffect(() => {
    dispatch(fetchPredictions({}));
  }, [dispatch]);

  // Handle prediction success
  useEffect(() => {
    if (prediction) {
      toast.success(`Prediction completed: ${prediction.prediction} (${prediction.confidence.toFixed(2)}%)`);
      dispatch(fetchPredictions({})); // Refresh the list
      dispatch(clearPrediction());
    }
  }, [prediction, dispatch]);

  // Handle prediction error
  useEffect(() => {
    if (predictError) {
      toast.error(`Prediction failed: ${predictError}`);
      dispatch(clearPrediction());
    }
  }, [predictError, dispatch]);

  // Handle delete success
  useEffect(() => {
    if (deleteSuccess) {
      toast.success('Prediction deleted successfully');
      dispatch(fetchPredictions({})); // Refresh the list
      dispatch(resetDeleteState());
    }
  }, [deleteSuccess, dispatch]);

  // Handle delete error
  useEffect(() => {
    if (deleteError) {
      toast.error(`Delete failed: ${deleteError}`);
      dispatch(resetDeleteState());
    }
  }, [deleteError, dispatch]);

  const handleParamChange = (id: string, value: string | number) => {
    const updateParams = (params: Param[]) =>
      params.map((p) => (p.id === id ? { ...p, value } : p));
    if (primaryParams.find((p) => p.id === id)) {
      setPrimaryParams(updateParams);
    } else {
      setExtraParams(updateParams);
    }
  };

  const handleStart = () => {
    // Convert params to the format expected by the API
    const predictionData: Partial<PredictionParams> = {};
    [...primaryParams, ...extraParams].forEach((param) => {
      if (param.value !== '' && param.value !== null && param.value !== undefined) {
        predictionData[param.id as keyof PredictionParams] = typeof param.value === 'string' ? parseFloat(param.value) : param.value;
      }
    });

    // Ensure all required parameters are present (add defaults for missing ones)
    const requiredDefaults: PredictionParams = {
      koi_fpflag_nt: 0.0,
      koi_fpflag_ss: 0.0,
      koi_fpflag_co: 0.0,
      koi_fpflag_ec: 0.0,
      koi_period: 0.0, // Will be overridden by user input
      koi_period_err1: 0.00000582,
      koi_period_err2: -0.00000582,
      koi_time0bk: 134.51415,
      koi_time0bk_err1: 0.00041,
      koi_time0bk_err2: -0.00041,
      koi_impact: 0.586,
      koi_impact_err1: 0.115,
      koi_impact_err2: -0.115,
      koi_duration: 2.8092,
      koi_duration_err1: 0.0094,
      koi_duration_err2: -0.0094,
      koi_depth: 2793.0,
      koi_depth_err1: 29.0,
      koi_depth_err2: -29.0,
      koi_prad: 0.0, // Will be overridden
      koi_prad_err1: 0.11,
      koi_prad_err2: -0.11,
      koi_teq: 0.0, // Will be overridden
      koi_teq_err1: 19,
      koi_teq_err2: -19,
      koi_insol: 0.0, // Will be overridden
      koi_insol_err1: 5.4,
      koi_insol_err2: -5.4,
      koi_model_snr: 96.2,
      koi_tce_plnt_num: 1,
      koi_steff: 0.0, // Will be overridden
      koi_steff_err1: 81,
      koi_steff_err2: -81,
      koi_slogg: 4.467,
      koi_slogg_err1: 0.064,
      koi_slogg_err2: -0.064,
      koi_srad: 0.0, // Will be overridden
      koi_srad_err1: 0.105,
      koi_srad_err2: -0.105,
      ra: 291.93423,
      dec: 48.141651,
      koi_kepmag: 15.347
    };

    // Merge with defaults
    const completePredictionData = { ...requiredDefaults, ...predictionData };

    // Check if we have the minimum required parameters
    const requiredParams = ['koi_period', 'koi_prad', 'koi_teq', 'koi_insol', 'koi_steff', 'koi_srad'];
    const missingParams = requiredParams.filter(param => !(param in completePredictionData));

    if (missingParams.length > 0) {
      toast.error(`Missing required parameters: ${missingParams.join(', ')}`);
      return;
    }

    dispatch(makePrediction(completePredictionData as PredictionParams));
  };

  const handleDeletePrediction = (id: string) => {
    dispatch(deletePredictionById(id));
  };

  // Convert Redux predictions to component format
  const formattedPredictions: PredictionRow[] = reduxPredictions.map((pred) => ({
    id: pred.prediction_id,
    name: `Prediction ${pred.prediction_id.slice(-8)}`,
    prediction: pred.prediction,
    confidence: Math.round(pred.confidence * 100),
  }));

  return (
    <div className="min-h-screen bg-[#020617] text-slate-200 p-6 flex flex-col items-center">
      <div className="w-full max-w-6xl">
        <ModelSelectButton selectedModel={selectedModel} onModelChange={setSelectedModel} />
        <ParametersCard
          primaryParams={primaryParams}
          extraParams={extraParams}
          onParamChange={handleParamChange}
          onStart={handleStart}
        />
        <PredictionsTable
          predictions={formattedPredictions}
          onDelete={handleDeletePrediction}
        />
        {(predictLoading || fetchLoading || deleteLoading) && (
          <div className="text-center mt-4">
            <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500"></div>
            <p className="mt-2 text-slate-400">
              {predictLoading && 'Making prediction...'}
              {fetchLoading && 'Loading predictions...'}
              {deleteLoading && 'Deleting prediction...'}
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

export default PredictionPage;