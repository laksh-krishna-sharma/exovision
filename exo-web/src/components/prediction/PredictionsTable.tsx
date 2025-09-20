import { Button } from '@/components/ui/button';
import { Trash2 } from 'lucide-react'; // ← import trash icon
import type { PredictionRow } from './Types';

interface PredictionsTableProps {
  predictions: PredictionRow[];
  onDelete: (id: string) => void;
}

const PredictionsTable: React.FC<PredictionsTableProps> = ({ predictions, onDelete }) => {
  return (
    <div className="bg-black/30 backdrop-blur-md p-6 rounded-xl shadow-lg max-w-4xl w-full mt-8 border border-white/10">
      <h2 className="text-xl font-semibold text-white mb-4">Previous Records</h2>

      {predictions.length === 0 ? (
        <p className="text-white/60">No records yet.</p>
      ) : (
        <div className="max-h-64 overflow-y-auto">
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
                  <td className="py-2 px-2">{row.prediction}</td>
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
      )}
    </div>
  );
};

export default PredictionsTable;
