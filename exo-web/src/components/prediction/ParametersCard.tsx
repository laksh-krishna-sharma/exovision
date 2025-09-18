import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Slider } from '@/components/ui/slider';
import ExtrasDropdown from './ExtrasDropdown';
import type { Param } from './Types';

interface ParametersCardProps {
  primaryParams: Param[];
  extraParams: Param[];
  onParamChange: (id: string, value: string | number) => void;
  onStart: () => void;
}

const ParametersCard: React.FC<ParametersCardProps> = ({
  primaryParams,
  extraParams,
  onParamChange,
  onStart,
}) => {
  const [isExtrasOpen, setIsExtrasOpen] = useState(false);

  const handleStart = () => {
    onStart();
  };

  // Define slider ranges for each parameter
  const getSliderConfig = (paramId: string) => {
    switch (paramId) {
      case 'koi_period':
        return { min: 0, max: 500, step: 0.1 };
      case 'koi_prad':
        return { min: 0, max: 20, step: 0.1 };
      case 'koi_teq':
        return { min: 200, max: 3000, step: 10 };
      case 'koi_insol':
        return { min: 0, max: 500, step: 0.1 };
      case 'koi_steff':
        return { min: 2500, max: 10000, step: 50 };
      case 'koi_srad':
        return { min: 0.1, max: 20, step: 0.1 };
      default:
        return { min: 0, max: 100, step: 1 };
    }
  };

  return (
    <div className="bg-[#071029] p-6 rounded-lg shadow-lg max-w-4xl w-full">
      <h2 className="text-xl font-semibold text-slate-200 mb-6">Prediction Parameters</h2>

      {/* Primary Parameters with Sliders */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
        {primaryParams.map((param) => {
          const sliderConfig = getSliderConfig(param.id);
          return (
            <div key={param.id} className="space-y-2">
              <label htmlFor={param.id} className="block text-sm font-medium text-slate-400">
                {param.label}
              </label>
              <div className="space-y-2">
                <Slider
                  id={param.id}
                  value={typeof param.value === 'number' ? param.value : 0}
                  onValueChange={(value) => onParamChange(param.id, value)}
                  min={sliderConfig.min}
                  max={sliderConfig.max}
                  step={sliderConfig.step}
                  className="w-full"
                />
                <div className="flex justify-between text-xs text-slate-500">
                  <span>{sliderConfig.min}</span>
                  <span className="text-slate-200 font-medium">
                    {typeof param.value === 'number' ? param.value.toFixed(1) : param.value}
                  </span>
                  <span>{sliderConfig.max}</span>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      <ExtrasDropdown
        extraParams={extraParams}
        isOpen={isExtrasOpen}
        onToggle={() => setIsExtrasOpen(!isExtrasOpen)}
        onParamChange={onParamChange}
      />
      <div className="flex justify-end mt-6">
        <Button onClick={handleStart} className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-2">
          Start Prediction
        </Button>
      </div>
    </div>
  );
};

export default ParametersCard;