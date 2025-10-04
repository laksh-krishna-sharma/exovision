// src/data/planetParameters.ts

export const planetParameters = {
  basic: [
    {
      name: "Orbital Period",
      unit: "days",
      description:
        "The time the planet takes to complete one orbit around its host star. Shorter periods usually indicate planets are very close to their star (like 'hot Jupiters'), while longer periods suggest wider orbits, potentially within the habitable zone.",
      min: 0,
      max: 500,
    },
    {
      name: "Planet Radius",
      unit: "Earth radii",
      description:
        "The size of the planet compared to Earth. A radius of 1 means Earth-sized. Smaller radii (<1) could indicate rocky planets, while larger radii (>10) are usually gas giants.",
      min: 0,
      max: 20,
    },
    {
      name: "Equilibrium Temperature",
      unit: "K",
      description:
        "Estimated temperature assuming no atmosphere. It is determined by the planet’s distance from the star and stellar luminosity. Lower values (<400K) could allow liquid water under certain conditions, while higher values (>1000K) indicate hot, uninhabitable planets.",
      min: 200,
      max: 3000,
    },
    {
      name: "Insolation",
      unit: "Earth = 1",
      description:
        "The relative stellar flux (energy received) compared to Earth. Values near 1 suggest Earth-like stellar heating. Values <0.5 may indicate planets too cold, and >2 suggest planets may be too hot for habitability.",
      min: 0,
      max: 500,
    },
    {
      name: "Stellar Effective Temperature",
      unit: "K",
      description:
        "The average surface temperature of the host star. Cool stars (3000–4000K) are typically red dwarfs, while hot stars (>7000K) are blue/white stars. This strongly affects planet climate and possible habitability.",
      min: 2500,
      max: 10000,
    },
    {
      name: "Stellar Radius",
      unit: "Solar radii",
      description:
        "The star’s radius relative to the Sun. Larger stars emit more radiation, which can expand the habitable zone outward. Smaller stars, while cooler, often host planets very close-in.",
      min: null,
      max: null,
    },
  ],

  koi: [
    { name: "KOI FP Flag NT", description: "Indicates a potential false positive based on the 'NT' (Non-Transit) detection method. A flag here suggests the signal may not be from a transiting planet." },
    { name: "KOI FP Flag SS", description: "Possible false positive from the 'SS' (Stellar Signal) method, meaning variability in the star itself might mimic a planet signal." },
    { name: "KOI FP Flag CO", description: "Flagged false positive candidate due to contamination from nearby objects (blended or background stars)." },
    { name: "KOI FP Flag EC", description: "False positive based on 'EC' (Eclipsing Binary Candidate) detection — a binary star system mistaken as a planet." },
    { name: "KOI Period Err1", description: "Upper error bound of the orbital period measurement. Indicates uncertainty in how precisely the planet’s year is measured." },
    { name: "KOI Period Err2", description: "Lower error bound of the orbital period measurement." },
    { name: "KOI Time0 BK", description: "Calculated mid-point time (Barycentric Kepler Julian Date) of a planet transit. Critical for predicting future transits." },
    { name: "KOI Time0bk Err1", description: "Upper uncertainty margin for mid-transit time." },
    { name: "KOI Time0bk Err2", description: "Lower uncertainty margin for mid-transit time." },
    { name: "KOI Impact", description: "Impact parameter: the distance (scaled by stellar radius) between the planet's transit path and the star’s center. Values near 0 mean central transits; values near 1 mean grazing transits." },
    { name: "KOI Impact Err1", description: "Upper error estimate for the impact parameter." },
    { name: "KOI Impact Err2", description: "Lower error estimate for the impact parameter." },
    { name: "KOI Duration", description: "Total duration (in hours) of the planet’s transit across its star. Short durations can indicate small planets or fast-moving orbits." },
    { name: "KOI Duration Err1", description: "Upper uncertainty of transit duration." },
    { name: "KOI Duration Err2", description: "Lower uncertainty of transit duration." },
    { name: "KOI Depth", description: "Transit depth (ppm): how much starlight is blocked during transit. Larger depths usually mean larger planets." },
    { name: "KOI Depth Err1", description: "Upper uncertainty for transit depth measurement." },
    { name: "KOI Depth Err2", description: "Lower uncertainty for transit depth measurement." },
    { name: "KOI Planet Radius Err1", description: "Upper uncertainty in the measured planet radius." },
    { name: "KOI Planet Radius Err2", description: "Lower uncertainty in the measured planet radius." },
    { name: "KOI Equilibrium Temp Err1", description: "Upper error in the equilibrium temperature estimate." },
    { name: "KOI Equilibrium Temp Err2", description: "Lower error in the equilibrium temperature estimate." },
    { name: "KOI Insolation Err1", description: "Upper uncertainty in the insolation estimate." },
    { name: "KOI Insolation Err2", description: "Lower uncertainty in the insolation estimate." },
    { name: "KOI Model SNR", description: "Signal-to-noise ratio (SNR) of the transit detection. Higher SNR (>10) indicates more reliable detections." },
    { name: "KOI TCE Planet Num", description: "Sequence number of the planet in Threshold Crossing Events (TCEs). Identifies multiple planets in the same system." },
    { name: "KOI Stellar Effective Temp Err1", description: "Upper error bound in the host star’s effective temperature." },
    { name: "KOI Stellar Effective Temp Err2", description: "Lower error bound in the host star’s effective temperature." },
    { name: "KOI Stellar Surface Gravity", description: "Logarithm of the star’s surface gravity (log g). Helps classify star type (dwarfs vs giants)." },
    { name: "KOI Stellar Surface Gravity Err1", description: "Upper uncertainty in log g." },
    { name: "KOI Stellar Surface Gravity Err2", description: "Lower uncertainty in log g." },
    { name: "KOI Stellar Radius Err1", description: "Upper uncertainty in stellar radius." },
    { name: "KOI Stellar Radius Err2", description: "Lower uncertainty in stellar radius." },
    { name: "Right Ascension", description: "Celestial coordinate (longitude) of the star’s position in the sky, measured in hours, minutes, seconds." },
    { name: "Declination", description: "Celestial coordinate (latitude) of the star’s position, measured in degrees north or south of the celestial equator." },
    { name: "KOI Kepler Magnitude", description: "Brightness of the star in the Kepler bandpass. Lower values mean brighter stars, which improve planet detectability." },
  ],
};
