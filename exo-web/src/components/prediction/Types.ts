export interface Param {
  id: string;
  label: string;
  value: string | number;
  type: 'text' | 'number';
}

export interface PredictionRow {
  id: string;
  name: string;
  prediction: string;
  confidence: number;
}