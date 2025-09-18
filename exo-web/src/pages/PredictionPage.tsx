import { useState } from 'react';
import ModelSelectButton from '@/components/prediction/ModelSelectButton';
import ParametersCard from '@/components/prediction/ParametersCard';
import PredictionsTable from '@/components/prediction/PredictionsTable';
import type { Param, PredictionRow } from '@/components/prediction/Types';

const PredictionPage: React.FC = () => {
  const [selectedModel, setSelectedModel] = useState('Model A');
  const [primaryParams, setPrimaryParams] = useState<Param[]>([
    { id: 'param1', label: 'Parameter 1', value: '', type: 'text' },
    { id: 'param2', label: 'Parameter 2', value: '', type: 'number' },
    { id: 'param3', label: 'Parameter 3', value: '', type: 'text' },
    { id: 'param4', label: 'Parameter 4', value: '', type: 'number' },
  ]);
  const [extraParams, setExtraParams] = useState<Param[]>(
    Array.from({ length: 24 }, (_, i) => ({
      id: `extra${i + 1}`,
      label: `Extra Parameter ${i + 1}`,
      value: '',
      type: i % 2 === 0 ? 'text' : 'number',
    }))
  );
  const [predictions, setPredictions] = useState<PredictionRow[]>([]); // In-memory storage

  const handleParamChange = (id: string, value: string | number) => {
    const updateParams = (params: Param[]) =>
      params.map((p) => (p.id === id ? { ...p, value } : p));
    if (primaryParams.find((p) => p.id === id)) {
      setPrimaryParams(updateParams);
    } else {
      setExtraParams(updateParams);
    }
  };

  const handleStart = (params: Param[]) => {
    // Simulate adding a prediction (replace with actual logic)
    const newPrediction: PredictionRow = {
      id: Date.now().toString(),
      name: `Prediction ${predictions.length + 1}`,
      prediction: 'Sample Result', // TODO: Replace with API response
      confidence: Math.floor(Math.random() * 100),
    };
    setPredictions([...predictions, newPrediction]);
  };

  const handleDeletePrediction = (id: string) => {
    setPredictions(predictions.filter((p) => p.id !== id));
  };

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
        <PredictionsTable predictions={predictions} onDelete={handleDeletePrediction} />
      </div>
    </div>
  );
};

export default PredictionPage;