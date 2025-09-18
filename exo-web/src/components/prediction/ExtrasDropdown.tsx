import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import type { Param } from './Types';

interface ExtrasDropdownProps {
  extraParams: Param[];
  isOpen: boolean;
  onToggle: () => void;
  onParamChange: (id: string, value: string | number) => void;
}

const ExtrasDropdown: React.FC<ExtrasDropdownProps> = ({
  extraParams,
  isOpen,
  onToggle,
  onParamChange,
}) => {
  return (
    <div>
      <Button onClick={onToggle} variant="outline" className="w-full mb-2 bg-slate-800 border-slate-600 text-slate-200">
        {isOpen ? 'Hide' : 'Show'} Extra Parameters ({extraParams.length})
      </Button>
      {isOpen && (
        <div className="max-h-64 overflow-y-auto border border-slate-600 rounded p-4 bg-slate-900">
          {extraParams.map((param) => (
            <div key={param.id} className="mb-3">
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
      )}
    </div>
  );
};

export default ExtrasDropdown;