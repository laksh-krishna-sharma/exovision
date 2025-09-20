import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
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

  const getSliderConfig = (paramId: string) => {
    switch (paramId) {
      case 'koi_period': return { min: 0, max: 500, step: 0.1 };
      case 'koi_prad': return { min: 0, max: 20, step: 0.1 };
      case 'koi_teq': return { min: 200, max: 3000, step: 10 };
      case 'koi_insol': return { min: 0, max: 500, step: 0.1 };
      case 'koi_steff': return { min: 2500, max: 10000, step: 50 };
      case 'koi_srad': return { min: 0.1, max: 20, step: 0.1 };
      default: return { min: 0, max: 100, step: 1 };
    }
  };

  return (
    <div className="bg-black/30 backdrop-blur-md p-6 rounded-xl shadow-lg w-full max-w-4xl border border-white/10">
      <h2 className="text-xl font-semibold text-white mb-6">Prediction Parameters</h2>

      {/* Primary Parameters with Input Boxes */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
        {primaryParams.map((param) => {
          const sliderConfig = getSliderConfig(param.id);
          return (
            <div key={param.id} className="space-y-2">
              <label htmlFor={param.id} className="block text-sm font-medium text-white/70">
                {param.label}
              </label>
              <div className="space-y-2">
                <Input
                  id={param.id}
                  type="number"
                  value={typeof param.value === 'number' ? param.value : ''}
                  onChange={(e) => {
                    const inputValue = e.target.value;
                    if (inputValue === '') {
                      onParamChange(param.id, 0);
                    } else {
                      const value = parseFloat(inputValue);
                      if (!isNaN(value)) {
                        onParamChange(param.id, value);
                      }
                    }
                  }}
                  min={sliderConfig.min}
                  max={sliderConfig.max}
                  step={sliderConfig.step}
                  className="w-full bg-black/20 border-white/20 text-white placeholder-white/50"
                />
                <div className="flex justify-between text-xs text-white/50">
                  <span>Min: {sliderConfig.min}</span>
                  <span className="text-white font-medium">
                    Current: {typeof param.value === 'number' ? param.value.toFixed(1) : param.value}
                  </span>
                  <span>Max: {sliderConfig.max}</span>
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
        <Button
          onClick={handleStart}
          className="bg-black/10 text-white hover:bg-black/20 border border-white/20
                     hover:shadow-[0_0_30px_rgba(0,150,255,0.5)] transition-shadow px-6 py-2"
        >
          Start Prediction
        </Button>
      </div>
    </div>
  );
};

export default ParametersCard;
