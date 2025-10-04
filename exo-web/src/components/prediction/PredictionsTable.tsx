import { Button } from '@/components/ui/button';
import { Trash2 } from 'lucide-react'; // ← import trash icon
import type { PredictionRow } from './Types';

interface PredictionsTableProps {
  predictions: PredictionRow[];
  onDelete: (id: string) => void;
}

const PredictionsTable: React.FC<PredictionsTableProps> = ({ predictions, onDelete }) => {
  return (
    <div className="bg-black/30 backdrop-blur-md p-4 sm:p-6 rounded-xl shadow-lg max-w-4xl w-full mt-8 border border-white/10">
      <h2 className="text-lg sm:text-xl font-semibold text-white mb-4">Previous Records</h2>

      {predictions.length === 0 ? (
        <p className="text-white/60">No records yet.</p>
      ) : (
        <>
          {/* Desktop Table View */}
          <div className="hidden sm:block max-h-64 overflow-y-auto">
            <table className="w-full text-left text-white">
              <thead className="sticky top-0 bg-black/40 backdrop-blur-md z-10">
                <tr className="border-b border-white/20">
                  <th className="py-2 px-2">Name</th>
                  <th className="py-2 px-2">Prediction</th>
                  <th className="py-2 px-2">Confidence</th>
                  <th className="py-2 px-2">Actions</th>
                </tr>
              </thead>
              <tbody>
                {predictions.map((row) => (
                  <tr key={row.id} className="border-b border-white/10 hover:bg-white/5 transition">
                    <td className="py-2 px-2">{row.name}</td>
                    <td className="py-2 px-2">{(parseInt(row.prediction) === 1 ? "Planet found" : "Planet not found")}</td>
                    <td className="py-2 px-2">{row.confidence}%</td>
                    <td className="py-2 px-2">
                      <Button
                        onClick={() => onDelete(row.id)}
                        size="sm"
                        className="p-2 rounded-md bg-white/10 text-white border border-white/20 
               hover:bg-white/20 hover:shadow-[0_0_20px_rgba(255,0,0,0.6)] 
               transition-shadow"
                      >
                        <Trash2 className="w-4 h-4" />
                      </Button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Mobile Card View */}
          <div className="sm:hidden space-y-3 max-h-64 overflow-y-auto">
            {predictions.map((row) => (
              <div key={row.id} className="bg-white/5 backdrop-blur-sm rounded-lg p-4 border border-white/10">
                <div className="flex justify-between items-start mb-2">
                  <h3 className="text-white font-medium text-base">{row.name}</h3>
                  <Button
                    onClick={() => onDelete(row.id)}
                    size="sm"
                    className="p-2 rounded-md bg-white/10 text-white border border-white/20 
             hover:bg-white/20 hover:shadow-[0_0_20px_rgba(255,0,0,0.6)] 
             transition-shadow flex-shrink-0 ml-2"
                  >
                    <Trash2 className="w-4 h-4" />
                  </Button>
                </div>
                <div className="space-y-1 text-sm">
                  <div className="flex justify-between">
                    <span className="text-white/70">Prediction:</span>
                    <span className="text-white">{row.prediction === "1" ? "found" : "not found"}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-white/70">Confidence:</span>
                    <span className="text-white">{row.confidence}%</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </>
      )}
    </div>
  );
};

export default PredictionsTable;
