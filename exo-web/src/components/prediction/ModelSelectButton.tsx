import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';

interface ModelSelectButtonProps {
  selectedModel: string;
  onModelChange: (model: string) => void;
}

const ModelSelectButton: React.FC<ModelSelectButtonProps> = ({ selectedModel, onModelChange }) => {
  const models = [
    { id: 'kepler_ann', name: 'K2 (Kepler extended mission)' },
    
    { id: 'kepler_ann_savedmodel', name: 'TESS (Transiting Exoplanet Survey Satellite)' },
  ];

  return (
    <div className="mb-4 w-64">
      <label htmlFor="model-select" className="block text-sm font-medium text-white/70 mb-2">
        Select Model
      </label>
      <Select value={selectedModel} onValueChange={onModelChange}>
        <SelectTrigger
          id="model-select"
          className="bg-black/30 backdrop-blur-md border border-white/10 text-white hover:border-white/20"
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
  );
};

export default ModelSelectButton;
