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
      <Button
        onClick={onToggle}
        className="w-full mb-2 bg-black/10 text-white border border-white/20 
             backdrop-blur-sm hover:bg-black/20 
             hover:shadow-[0_0_30px_rgba(0,150,255,0.5)] 
             transition-shadow"
      >
        {isOpen ? "Hide" : "Show"} Extra Parameters ({extraParams.length})
      </Button>
      {isOpen && (
        <div className="max-h-64 overflow-y-auto border border-white/20 rounded p-4 bg-white/5 backdrop-blur-sm">
          {extraParams.map((param) => (
            <div key={param.id} className="mb-3">
              <label
                htmlFor={param.id}
                className="block text-sm font-medium text-white/70 mb-1"
              >
                {param.label}
              </label>
              <Input
                id={param.id}
                type={param.type}
                value={param.value}
                onChange={(e) =>
                  onParamChange(
                    param.id,
                    param.type === 'number'
                      ? Number(e.target.value)
                      : e.target.value
                  )
                }
                className="bg-white/5 border border-white/20 text-white/90 backdrop-blur-sm"
              />
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default ExtrasDropdown;
