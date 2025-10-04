// DatasetPage.tsx
import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";
import SpaceBackground from "@/components/spacebackground";
import { Button } from "@/components/ui/button";
import { planetParameters } from "@/components/Datasetsinfo/kepler"; // full parameters

const KeplerPage = () => {
  const navigate = useNavigate();

  return (
    <div className="relative min-h-screen text-white overflow-x-hidden flex flex-col">
      {/* Background */}
      <div className="absolute inset-0 -z-10">
        <SpaceBackground />
      </div>

      {/* Navbar */}
      <nav className="fixed top-0 left-0 w-full z-50 bg-transparent flex items-center px-6 py-4">
        <Button
          variant="secondary"
          onClick={() => navigate("/home")}
          className="bg-black/10 text-white hover:bg-black/20 border border-white/20 
                     hover:shadow-[0_0_30px_rgba(0,150,255,0.5)] transition-shadow"
        >
          ← Back
        </Button>
      </nav>

      {/* Content */}
      <section className="flex flex-col items-start justify-start min-h-screen px-6 sm:px-16 pt-28 space-y-10 pb-20">
        <motion.h1
          className="text-4xl md:text-5xl font-bold mb-4"
          initial={{ opacity: 0, y: -50 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
        >
          Kepler Dataset Details
        </motion.h1>
        <motion.p
          className="text-lg md:text-xl text-white/80 max-w-full leading-relaxed"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.3, duration: 0.8 }}
        >
          The Kepler mission observed 150,000 stars in a fixed patch of sky for 4 years, 
          producing high-quality light curves that led to thousands of exoplanet discoveries.  
          These datasets contain light curves — measurements of a star’s brightness 
          over time. By analyzing these dips in brightness, we identify potential 
          exoplanets.
        </motion.p>

      {/* Basic Parameters */}
<div className="w-full">
  <h2 className="text-2xl font-semibold mb-4">📡 Basic Parameters</h2>
  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
    {planetParameters.basic.map((param) => (
      <div key={param.name} className="p-4 rounded-lg border border-white/20 backdrop-blur-md">
        <h4 className="text-lg font-semibold mb-1">{param.name}</h4>
        <p className="text-white/80 text-sm">{param.description}</p>
      </div>
    ))}
  </div>
</div>

{/* KOI / Technical Parameters */}
<div className="w-full">
  <h2 className="text-2xl font-semibold text-cyan-300 mb-4">KOI / Technical Parameters</h2>
  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
    {planetParameters.koi.map((param) => (
      <div
        key={param.name}
        className="p-4 rounded-lg border border-white/20 backdrop-blur-md"
      >
        <h4 className="text-lg font-semibold mb-1">{param.name}</h4>
        <p className="text-white/80 text-sm">{param.description}</p>
      </div>
    ))}
  </div>
</div>
      </section>
    </div>
  );
};

export default KeplerPage;
