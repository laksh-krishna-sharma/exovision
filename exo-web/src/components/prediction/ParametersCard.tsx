import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import ExtrasDropdown from './ExtrasDropdown';
import type { Param } from './Types';

interface ParametersCardProps {
  primaryParams: Param[];
  extraParams: Param[];
  onParamChange: (id: string, value: string | number) => void;
  onStart: (params: Param[]) => void;
}

const ParametersCard: React.FC<ParametersCardProps> = ({
  primaryParams,
  extraParams,
  onParamChange,
  onStart,
}) => {
  const [isExtrasOpen, setIsExtrasOpen] = useState(false);

  const handleStart = () => {
    const allParams = [...primaryParams, ...extraParams];
    console.log({ params: allParams });
    // TODO: Replace console.log with call to prediction API or dispatch to Redux
    onStart(allParams);
  };

  return (
    <div className="bg-[#071029] p-6 rounded-lg shadow-lg max-w-2xl w-full">
      <h2 className="text-xl font-semibold text-slate-200 mb-4">Prediction Parameters</h2>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
        {primaryParams.map((param) => (
          <div key={param.id}>
            <label htmlFor={param.id} className="block text-sm font-medium text-slate-400 mb-1">
              {param.label}
            </label>
            <Input
              id={param.id}
              type={param.type}
              value={param.value}
              onChange={(e) => onParamChange(param.id, param.type === 'number' ? Number(e.target.value) : e.target.value)}
              className="bg-slate-800 border-slate-600 text-slate-200"
            />
          </div>
        ))}
      </div>
      <ExtrasDropdown
        extraParams={extraParams}
        isOpen={isExtrasOpen}
        onToggle={() => setIsExtrasOpen(!isExtrasOpen)}
        onParamChange={onParamChange}
      />
      <div className="flex justify-end mt-4">
        <Button onClick={handleStart} className="bg-blue-600 hover:bg-blue-700 text-white">
          Start Prediction
        </Button>
      </div>
    </div>
  );
};

export default ParametersCard;