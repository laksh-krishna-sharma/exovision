export interface ParamTess {
  id: string;
  label: string;
  value: string | number;
  type: 'text' | 'number';
}

export interface PredictionRowTess {
  id: string;
  name: string;
  prediction: string;
  confidence: number;
  planet?: string;
}