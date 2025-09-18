
import type { Param } from '@/components/prediction/Types';

// Primary parameters - user-facing sliders
export const defaultPrimaryParams: Param[] = [
  { id: 'koi_period', label: 'Orbital Period (days)', value: 3.52, type: 'number' },
  { id: 'koi_prad', label: 'Planet Radius (Earth radii)', value: 1.96, type: 'number' },
  { id: 'koi_teq', label: 'Equilibrium Temperature (K)', value: 1294, type: 'number' },
  { id: 'koi_insol', label: 'Insolation (Earth = 1)', value: 183.6, type: 'number' },
  { id: 'koi_steff', label: 'Stellar Effective Temperature (K)', value: 5455, type: 'number' },
  { id: 'koi_srad', label: 'Stellar Radius (Solar radii)', value: 0.927, type: 'number' },
];

// Extra parameters - moved to dropdown with default values from test_api.py
export const defaultExtraParams: Param[] = [
  { id: 'koi_fpflag_nt', label: 'KOI FP Flag NT', value: 0.0, type: 'number' },
  { id: 'koi_fpflag_ss', label: 'KOI FP Flag SS', value: 0.0, type: 'number' },
  { id: 'koi_fpflag_co', label: 'KOI FP Flag CO', value: 0.0, type: 'number' },
  { id: 'koi_fpflag_ec', label: 'KOI FP Flag EC', value: 0.0, type: 'number' },
  { id: 'koi_period_err1', label: 'KOI Period Err1', value: 0.00000582, type: 'number' },
  { id: 'koi_period_err2', label: 'KOI Period Err2', value: -0.00000582, type: 'number' },
  { id: 'koi_time0bk', label: 'KOI Time 0 BK', value: 134.51415, type: 'number' },
  { id: 'koi_time0bk_err1', label: 'KOI Time0bk Err1', value: 0.00041, type: 'number' },
  { id: 'koi_time0bk_err2', label: 'KOI Time0bk Err2', value: -0.00041, type: 'number' },
  { id: 'koi_impact', label: 'KOI Impact', value: 0.586, type: 'number' },
  { id: 'koi_impact_err1', label: 'KOI Impact Err1', value: 0.115, type: 'number' },
  { id: 'koi_impact_err2', label: 'KOI Impact Err2', value: -0.115, type: 'number' },
  { id: 'koi_duration', label: 'KOI Duration', value: 2.8092, type: 'number' },
  { id: 'koi_duration_err1', label: 'KOI Duration Err1', value: 0.0094, type: 'number' },
  { id: 'koi_duration_err2', label: 'KOI Duration Err2', value: -0.0094, type: 'number' },
  { id: 'koi_depth', label: 'KOI Depth', value: 2793.0, type: 'number' },
  { id: 'koi_depth_err1', label: 'KOI Depth Err1', value: 29.0, type: 'number' },
  { id: 'koi_depth_err2', label: 'KOI Depth Err2', value: -29.0, type: 'number' },
  { id: 'koi_prad_err1', label: 'KOI Planet Radius Err1', value: 0.11, type: 'number' },
  { id: 'koi_prad_err2', label: 'KOI Planet Radius Err2', value: -0.11, type: 'number' },
  { id: 'koi_teq_err1', label: 'KOI Equilibrium Temp Err1', value: 19, type: 'number' },
  { id: 'koi_teq_err2', label: 'KOI Equilibrium Temp Err2', value: -19, type: 'number' },
  { id: 'koi_insol_err1', label: 'KOI Insolation Err1', value: 5.4, type: 'number' },
  { id: 'koi_insol_err2', label: 'KOI Insolation Err2', value: -5.4, type: 'number' },
  { id: 'koi_model_snr', label: 'KOI Model SNR', value: 96.2, type: 'number' },
  { id: 'koi_tce_plnt_num', label: 'KOI TCE Planet Num', value: 1, type: 'number' },
  { id: 'koi_steff_err1', label: 'KOI Stellar Effective Temp Err1', value: 81, type: 'number' },
  { id: 'koi_steff_err2', label: 'KOI Stellar Effective Temp Err2', value: -81, type: 'number' },
  { id: 'koi_slogg', label: 'KOI Stellar Surface Gravity', value: 4.467, type: 'number' },
  { id: 'koi_slogg_err1', label: 'KOI Stellar Surface Gravity Err1', value: 0.064, type: 'number' },
  { id: 'koi_slogg_err2', label: 'KOI Stellar Surface Gravity Err2', value: -0.064, type: 'number' },
  { id: 'koi_srad_err1', label: 'KOI Stellar Radius Err1', value: 0.105, type: 'number' },
  { id: 'koi_srad_err2', label: 'KOI Stellar Radius Err2', value: -0.105, type: 'number' },
  { id: 'ra', label: 'Right Ascension', value: 291.93423, type: 'number' },
  { id: 'dec', label: 'Declination', value: 48.141651, type: 'number' },
  { id: 'koi_kepmag', label: 'KOI Kepler Magnitude', value: 15.347, type: 'number' },
];