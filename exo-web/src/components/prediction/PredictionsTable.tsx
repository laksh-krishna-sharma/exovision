import { Button } from '@/components/ui/button';
import type { PredictionRow } from './Types';

interface PredictionsTableProps {
  predictions: PredictionRow[];
  onDelete: (id: string) => void;
}

const PredictionsTable: React.FC<PredictionsTableProps> = ({ predictions, onDelete }) => {
  return (
    <div className="bg-[#071029] p-6 rounded-lg shadow-lg max-w-4xl w-full mt-8">
      <h2 className="text-xl font-semibold text-slate-200 mb-4">Previous Records</h2>
      {predictions.length === 0 ? (
        <p className="text-slate-400">No records yet.</p>
      ) : (
        <div className="max-h-64 overflow-y-auto">
          <table className="w-full text-left text-slate-200">
            <thead className="sticky top-0 bg-[#071029] z-10">
              <tr className="border-b border-slate-600">
                <th className="py-2">Name</th>
                <th className="py-2">Prediction</th>
                <th className="py-2">Confidence</th>
                <th className="py-2">Actions</th>
              </tr>
            </thead>
            <tbody>
              {predictions.map((row) => (
                <tr key={row.id} className="border-b border-slate-700">
                  <td className="py-2">{row.name}</td>
                  <td className="py-2">{row.prediction}</td>
                  <td className="py-2">{row.confidence}%</td>
                  <td className="py-2">
                    <Button
                      onClick={() => onDelete(row.id)}
                      variant="destructive"
                      size="sm"
                      className="text-xs"
                    >
                      Delete
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