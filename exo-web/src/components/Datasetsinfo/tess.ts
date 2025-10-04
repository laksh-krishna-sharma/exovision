// src/data/tess.ts

export const tessParameters = {
  basic: [
    {
      name: "Orbital Period",
      unit: "days",
      description:
        "Time the planet takes to complete one orbit around its host star. Shorter periods indicate planets closer to their star.",
      min: 0,
      max: 500,
    },
    {
      name: "Transit Duration",
      unit: "hours",
      description:
        "The time the planet takes to pass across its star as seen from Earth. Longer durations usually indicate bigger stars or slower-moving planets.",
      min: 0,
      max: 30,
    },
    {
      name: "Transit Depth",
      unit: "%",
      description:
        "The fraction of starlight blocked by the planet during transit. Deeper dips usually mean bigger planets.",
      min: 0,
      max: 5,
    },
    {
      name: "Planet Radius",
      unit: "Earth radii",
      description:
        "The size of the planet compared to Earth. A radius of 1 means Earth-sized, larger values indicate bigger planets.",
      min: 0,
      max: 20,
    },
    {
      name: "Insolation",
      unit: "Earth = 1",
      description:
        "The amount of stellar energy the planet receives compared to Earth. Higher values mean the planet is hotter.",
      min: 0,
      max: 500,
    },
    {
      name: "Equilibrium Temperature",
      unit: "K",
      description:
        "The estimated average temperature of the planet assuming no atmosphere.",
      min: 200,
      max: 4000,
    },
    {
      name: "Stellar Effective Temperature",
      unit: "K",
      description:
        "The surface temperature of the host star. Hotter stars emit more radiation and affect planetary climate.",
      min: 2500,
      max: 10000,
    },
    {
      name: "Stellar Surface Gravity",
      unit: "log(g)",
      description:
        "The logarithm of the host star's surface gravity, linked to its mass and radius.",
      min: 0,
      max: 5,
    },
    {
      name: "Stellar Radius",
      unit: "Solar radii",
      description:
        "The size of the host star compared to the Sun. Larger stars emit more energy.",
      min: 0,
      max: 10,
    },
  ],
};
