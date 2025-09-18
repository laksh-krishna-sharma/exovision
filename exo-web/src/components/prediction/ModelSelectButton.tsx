// import { useState } from 'react';
// import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'; 

interface ModelSelectButtonProps {
  selectedModel: string;
  onModelChange: (model: string) => void;
}

const ModelSelectButton: React.FC<ModelSelectButtonProps> = ({ selectedModel, onModelChange }) => {
  // TODO: Replace static model list with dynamic API call
  const models = ['Model A', 'Model B', 'Model C'];

  return (
    <div className="mb-4">
      <label htmlFor="model-select" className="block text-sm font-medium text-slate-400 mb-2">
        Select Model
      </label>
      <Select value={selectedModel} onValueChange={onModelChange}>
        <SelectTrigger id="model-select" className="w-48 bg-[#071029] border-slate-600 text-slate-200">
          <SelectValue placeholder="Choose a model" />
        </SelectTrigger>
        <SelectContent className="bg-[#071029] border-slate-600">
          {models.map((model) => (
            <SelectItem key={model} value={model} className="text-slate-200 hover:bg-slate-700">
              {model}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
    </div>
  );
};

export default ModelSelectButton;