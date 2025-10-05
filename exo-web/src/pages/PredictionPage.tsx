import { useState, useEffect } from "react";
import { useSelector } from "react-redux";
import { toast } from "react-toastify";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion"; 
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import ParametersCard from "@/components/prediction/ParametersCard";
import PredictionsTable from "@/components/prediction/PredictionsTable";
import type { Param, PredictionRow } from "@/components/prediction/Types";
import ParametersCardTess from "@/components/tess/ParametersCard";
import PredictionsTableTess from "@/components/tess/PredictionsTable";
import type { PredictionRowTess } from "@/components/tess/Types";
import { makePrediction, clearPrediction, type PredictionParams } from "@/store/slices/kepler/predictSlice";
import { fetchPredictions } from "@/store/slices/kepler/getPredictSlice";
import { deletePredictionById, resetDeleteState } from "@/store/slices/kepler/deletePredictByIDSlice";
import { makeTessPrediction, clearTessPrediction, type TessPredictionParams } from "@/store/slices/tess/tessPredictSlice";
import { fetchTessPredictions } from "@/store/slices/tess/getTessPredictSlice";
import { deleteTessPredictionById, resetTessDeleteState } from "@/store/slices/tess/deleteTessPredictByIDSlice";
import type { RootState } from "@/store";
import { useAppDispatch } from "@/store";
import { defaultPrimaryParams, defaultExtraParams } from "@/staticValues/kepler_static_values";
import SpaceBackground from "@/components/spacebackground";
import Navbar from "@/components/Navbar";
import { logout } from "@/store/slices/auth/loginSlice";

const PredictionPage: React.FC = () => {
  const navigate = useNavigate();
  const dispatch = useAppDispatch();
  const [selectedModel, setSelectedModel] = useState("xgb_full_train");

  const [primaryParams, setPrimaryParams] = useState<Param[]>(defaultPrimaryParams);
  const [extraParams, setExtraParams] = useState<Param[]>(defaultExtraParams);

  const { loading: predictLoading, prediction, error: predictError } = useSelector(
    (state: RootState) => state.keplerPredictionData
  );
  const { loading: fetchLoading, predictions: reduxPredictions } = useSelector(
    (state: RootState) => state.keplerGetPredictionData
  );
  const { loading: deleteLoading, success: deleteSuccess, error: deleteError } = useSelector(
    (state: RootState) => state.deletePredictByIdData
  );

  const { loading: tessPredictLoading, prediction: tessPrediction, error: tessPredictError } = useSelector(
    (state: RootState) => state.tessPredictionData
  );
  const { loading: tessFetchLoading, predictions: tessReduxPredictions } = useSelector(
    (state: RootState) => state.tessGetPredictionData
  );
  const { loading: tessDeleteLoading, success: tessDeleteSuccess, error: tessDeleteError } = useSelector(
    (state: RootState) => state.deleteTessPredictByIdData
  );

  const user_id = parseInt(localStorage.getItem("user_id") || "0");

  const models = [
    { id: 'xgb_full_train', name: 'K2 (Kepler extended mission)' },
    { id: 'kepler_ann_savedmodel', name: 'TESS (Transiting Exoplanet Survey Satellite)' },
  ];

  // Load predictions on mount
  useEffect(() => {
    if (user_id) {
      dispatch(fetchPredictions({ user_id }));
      dispatch(fetchTessPredictions({ user_id }));
    }
  }, [dispatch, user_id]);

  // Toast effects
  useEffect(() => {
    if (prediction) {
      toast.success(`Prediction completed: ${prediction.prediction} (${prediction.confidence.toFixed(2)}%)`);
      if (user_id) {
        dispatch(fetchPredictions({ user_id }));
      }
      dispatch(clearPrediction());
    }
  }, [prediction, dispatch, user_id]);

  useEffect(() => {
    if (predictError) {
      toast.error(`Prediction failed: ${predictError}`);
      dispatch(clearPrediction());
    }
  }, [predictError, dispatch]);

  useEffect(() => {
    if (tessPrediction) {
      toast.success(`TESS Prediction completed: ${tessPrediction.prediction} (${tessPrediction.confidence.toFixed(2)}%)`);
      if (user_id) {
        dispatch(fetchTessPredictions({ user_id }));
      }
      dispatch(clearTessPrediction());
    }
  }, [tessPrediction, dispatch, user_id]);

  useEffect(() => {
    if (tessPredictError) {
      toast.error(`TESS Prediction failed: ${tessPredictError}`);
      dispatch(clearTessPrediction());
    }
  }, [tessPredictError, dispatch]);

  useEffect(() => {
    if (deleteSuccess) {
      toast.success("Prediction deleted successfully");
      dispatch(fetchPredictions({ user_id }));
      dispatch(resetDeleteState());
    }
  }, [deleteSuccess, dispatch, user_id]);

  useEffect(() => {
    if (deleteError) {
      toast.error(`Delete failed: ${deleteError}`);
      dispatch(resetDeleteState());
    }
  }, [deleteError, dispatch]);

  useEffect(() => {
    if (tessDeleteSuccess) {
      toast.success("TESS Prediction deleted successfully");
      dispatch(fetchTessPredictions({ user_id }));
      dispatch(resetTessDeleteState());
    }
  }, [tessDeleteSuccess, dispatch, user_id]);

  useEffect(() => {
    if (tessDeleteError) {
      toast.error(`TESS Delete failed: ${tessDeleteError}`);
      dispatch(resetTessDeleteState());
    }
  }, [tessDeleteError, dispatch]);

  const handleParamChange = (id: string, value: string | number) => {
    const updateParams = (params: Param[]) => params.map((p) => (p.id === id ? { ...p, value } : p));
    if (primaryParams.find((p) => p.id === id)) setPrimaryParams(updateParams);
    else setExtraParams(updateParams);
  };

  const handleStart = () => {
    if (selectedModel === 'kepler_ann' || selectedModel === 'xgb_full_train') {
      handleKeplerStart();
    } else if (selectedModel === 'kepler_ann_savedmodel') {
      handleTessStart();
    }
  };

  const handleKeplerStart = () => {
    const predictionData: Partial<PredictionParams> = {};
    [...primaryParams, ...extraParams].forEach((param) => {
      if (param.value !== "" && param.value !== null && param.value !== undefined) {
        predictionData[param.id as keyof PredictionParams] =
          typeof param.value === "string" ? parseFloat(param.value) : param.value;
      }
    });

    const requiredDefaults: PredictionParams = {
      koi_fpflag_nt: 0.0,
      koi_fpflag_ss: 0.0,
      koi_fpflag_co: 0.0,
      koi_fpflag_ec: 0.0,
      koi_period: 0.0,
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
      koi_prad: 0.0,
      koi_prad_err1: 0.11,
      koi_prad_err2: -0.11,
      koi_teq: 0.0,
      koi_teq_err1: 19,
      koi_teq_err2: -19,
      koi_insol: 0.0,
      koi_insol_err1: 5.4,
      koi_insol_err2: -5.4,
      koi_model_snr: 96.2,
      koi_tce_plnt_num: 1,
      koi_steff: 0.0,
      koi_steff_err1: 81,
      koi_steff_err2: -81,
      koi_slogg: 4.467,
      koi_slogg_err1: 0.064,
      koi_slogg_err2: -0.064,
      koi_srad: 0.0,
      koi_srad_err1: 0.105,
      koi_srad_err2: -0.105,
      ra: 291.93423,
      dec: 48.141651,
      koi_kepmag: 15.347,
    };

    const completePredictionData = { ...requiredDefaults, ...predictionData };

    const requiredParams = ["koi_period", "koi_prad", "koi_teq", "koi_insol", "koi_steff", "koi_srad"];
    const missingParams = requiredParams.filter((param) => !(param in completePredictionData));

    if (missingParams.length > 0) {
      toast.error(`Missing required parameters: ${missingParams.join(", ")}`);
      return;
    }

    dispatch(makePrediction({ params: completePredictionData as PredictionParams, user_id }));
  };

  const handleTessStart = () => {
    const predictionData: Partial<TessPredictionParams> = {};
    [...primaryParams, ...extraParams].forEach((param) => {
      if (param.value !== "" && param.value !== null && param.value !== undefined) {
        predictionData[param.id as keyof TessPredictionParams] =
          typeof param.value === "string" ? parseFloat(param.value) : param.value;
      }
    });

    const requiredDefaults: TessPredictionParams = {
      pl_orbper: 1.0,
      pl_trandurh: 1.0,
      pl_trandep: 1.0,
      pl_rade: 1.0,
      pl_insol: 1.0,
      pl_eqt: 1.0,
      st_teff: 1.0,
      st_logg: 1.0,
      st_rad: 1.0,
    };

    const completePredictionData = { ...requiredDefaults, ...predictionData };

    // All are required, so no missing check for now

    dispatch(makeTessPrediction({ params: completePredictionData as TessPredictionParams, user_id }));
  };

  const handleDeletePrediction = (id: string) => {
    if (selectedModel === 'kepler_ann' || selectedModel === 'xgb_full_train') {
      dispatch(deletePredictionById(id));
    } else if (selectedModel === 'kepler_ann_savedmodel') {
      dispatch(deleteTessPredictionById(id));
    }
  };

  const formattedPredictions: PredictionRow[] = reduxPredictions.map((pred) => ({
    id: pred.prediction_id,
    name: `Prediction ${pred.prediction_id.slice(-8)}`,
    prediction: pred.prediction,
    confidence: Math.round(pred.confidence * 100),
  }));

  const formattedTessPredictions: PredictionRowTess[] = tessReduxPredictions.map((pred) => ({
    id: pred.prediction_id,
    name: `TESS Prediction ${pred.prediction_id.slice(-8)}`,
    prediction: pred.prediction,
    confidence: Math.round(pred.confidence * 100),
  }));

  return (
    <div className="relative min-h-screen text-slate-200 flex flex-col items-center p-2 overflow-hidden">
      {/* Navbar */}
      <Navbar logout={() => {
        dispatch(logout());
        navigate("/");
      }} />

      {/* Space background */}
      <div className="absolute inset-0 -z-10">
        <SpaceBackground />
      </div>

      {/* Main Card with Popup Animation */}
      <motion.div
        initial={{ opacity: 0, scale: 0.85, y: 40 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
        className="w-full flex flex-col items-center
                   bg-transparent border border-white/10 rounded-xl
                   backdrop-blur-lg shadow-[0_0_20px_rgba(255,255,255,0.1)] p-3 sm:p-4 mt-16"
      >
        {/* Inline Model Select Button */}
        <div className="mb-4 w-64">
          <label htmlFor="model-select" className="block text-4xl text-center font-medium text-white/70 mb-2">
            Select Model
          </label>
          <Select value={selectedModel} onValueChange={setSelectedModel}>
            <SelectTrigger
              id="model-select"
              className="bg-black/30 backdrop-blur-md border border-white/10 text-white hover:border-white/20 text-lg"
            >
              <SelectValue placeholder="Choose a model" />
            </SelectTrigger>
            <SelectContent className="bg-black/30 backdrop-blur-md border border-white/10 text-white">
              {models.map((model) => (
                <SelectItem
                  key={model.id}
                  value={model.id}
                  className="text-white hover:bg-white/10 hover:text-white transition-colors"
                >
                  {model.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        {selectedModel === 'xgb_full_train' ? (
          <>
            <ParametersCard
              primaryParams={primaryParams}
              extraParams={extraParams}
              onParamChange={handleParamChange}
              onStart={handleStart}
            />
            <PredictionsTable predictions={formattedPredictions} onDelete={handleDeletePrediction} />
          </>
        ) : selectedModel === 'kepler_ann_savedmodel' ? (
          <>
            <ParametersCardTess
              primaryParams={primaryParams}
              extraParams={extraParams}
              onParamChange={handleParamChange}
              onStart={handleStart}
            />
            <PredictionsTableTess predictions={formattedTessPredictions} onDelete={handleDeletePrediction} />
          </>
        ) : null}
        
        {((selectedModel === 'kepler_ann' || selectedModel === 'xgb_full_train') && (predictLoading || fetchLoading || deleteLoading)) ||
         (selectedModel === 'kepler_ann_savedmodel' && (tessPredictLoading || tessFetchLoading || tessDeleteLoading)) ? (
          <div className="text-center mt-4">
            <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-black"></div>
            <p className="mt-2 text-slate-400">
              {predictLoading && "Making prediction..."}
              {fetchLoading && "Loading predictions..."}
              {deleteLoading && "Deleting prediction..."}
              {tessPredictLoading && "Making TESS prediction..."}
              {tessFetchLoading && "Loading TESS predictions..."}
              {tessDeleteLoading && "Deleting TESS prediction..."}
            </p>
          </div>
        ) : null}
      </motion.div>
    </div>
  );
};

export default PredictionPage;