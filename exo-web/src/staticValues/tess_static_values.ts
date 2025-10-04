import type { Param } from "@/components/prediction/Types";

export const defaultTessPrimaryParams: Param[] = [
  { id: 'pl_orbper', label: 'Orbital Period (days)', value: 8.5, type: 'number' },
  { id: 'pl_trandurh', label: 'Transit Duration (hours)', value: 2.5, type: 'number' },
  { id: 'pl_trandep', label: 'Transit Depth (ppm)', value: 1000.0, type: 'number' },
  { id: 'pl_rade', label: 'Planet Radius (Earth radii)', value: 2.0, type: 'number' },
  { id: 'pl_insol', label: 'Insolation Flux (Earth units)', value: 5.0, type: 'number' },
  { id: 'pl_eqt', label: 'Equilibrium Temperature (K)', value: 1000.0, type: 'number' },
  { id: 'st_teff', label: 'Stellar Effective Temperature (K)', value: 5500.0, type: 'number' },
  { id: 'st_logg', label: 'Stellar Surface Gravity (log g)', value: 4.5, type: 'number' },
  { id: 'st_rad', label: 'Stellar Radius (Solar radii)', value: 1.0, type: 'number' },
];

export const defaultTessExtraParams: Param[] = [];
