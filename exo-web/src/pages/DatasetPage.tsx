// DatasetPage.tsx
import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";
import SpaceBackground from "@/components/spacebackground";
import { Button } from "@/components/ui/button";

const DatasetPage = () => {
  const navigate = useNavigate();

  return (
    <div className="relative min-h-screen text-white overflow-hidden flex flex-col">
      {/* Background */}
      <div className="absolute inset-0 -z-10">
        <SpaceBackground />
      </div>

      {/* Navbar */}
      <nav className="fixed top-0 left-0 w-full z-50 bg-transparent flex items-center px-6 py-4">
        <Button
          variant="secondary"
          onClick={() => navigate("/")}
          className="text-sm md:text-base px-3 py-1 md:px-4 md:py-2"
        >
          ← Back
        </Button>
      </nav>

      {/* Content */}
      <section className="flex flex-col items-center justify-center min-h-screen px-6 sm:px-16 pt-28">
        <motion.h1
          className="text-4xl md:text-5xl font-bold mb-8"
          initial={{ opacity: 0, y: -50 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
        >
          Dataset Details
        </motion.h1>
        <motion.p
          className="text-lg md:text-xl text-white/80 max-w-4xl leading-relaxed"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.3, duration: 0.8 }}
        >
          Our model is powered by stellar datasets from NASA missions such as 
          <span className="text-cyan-300"> Kepler </span> and 
          <span className="text-cyan-300"> TESS</span>.  
          These datasets contain light curves — measurements of a star’s brightness 
          over time. By analyzing these dips in brightness, we identify potential 
          exoplanets.  
        </motion.p>

        <div className="mt-10 grid grid-cols-1 md:grid-cols-2 gap-8 max-w-5xl">
          <div className="p-6 rounded-lg border border-white/20 backdrop-blur-md">
            <h2 className="text-2xl font-semibold mb-3">📡 Kepler Dataset</h2>
            <p className="text-white/80">
              The Kepler mission observed 150,000 stars in a fixed patch of sky for 4 years, 
              producing high-quality light curves that led to thousands of exoplanet discoveries.
            </p>
          </div>
          <div className="p-6 rounded-lg border border-white/20 backdrop-blur-md">
            <h2 className="text-2xl font-semibold mb-3">🔭 TESS Dataset</h2>
            <p className="text-white/80">
              TESS scans nearly the entire sky, observing 26 different sectors. 
              It’s designed to find planets around nearby bright stars, perfect for 
              follow-up studies.
            </p>
          </div>
        </div>
      </section>
    </div>
  );
};

export default DatasetPage;
