// import { useState } from 'react';
// import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';

interface ModelSelectButtonProps {
  selectedModel: string;
  onModelChange: (model: string) => void;
}

const ModelSelectButton: React.FC<ModelSelectButtonProps> = ({ selectedModel, onModelChange }) => {
  // Available models based on the backend models directory
  const models = [
    { id: 'kepler_ann', name: 'Kepler' },
    { id: 'xgb_full_train', name: 'K2 (Kepler extended mission)' },
    { id: 'kepler_ann_savedmodel', name: 'TESS (Transiting Exoplanet Survey Satellite)' },
  ];

  return (
    <div className="mb-4">
      <label htmlFor="model-select" className="block text-sm font-medium text-slate-400 mb-2">
        Select Model
      </label>
      <Select value={selectedModel} onValueChange={onModelChange}>
        <SelectTrigger id="model-select" className="w-64 bg-[#071029] border-slate-600 text-slate-200">
          <SelectValue placeholder="Choose a model" />
        </SelectTrigger>
        <SelectContent className="bg-[#071029] border-slate-600">
          {models.map((model) => (
            <SelectItem key={model.id} value={model.id} className="text-slate-200 hover:bg-slate-700">
              {model.name}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
    </div>
  );
};

export default ModelSelectButton;