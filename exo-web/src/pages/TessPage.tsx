// src/pages/TessPage.tsx
import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";
import SpaceBackground from "@/components/spacebackground";
import { Button } from "@/components/ui/button";
import { tessParameters } from "@/components/Datasetsinfo/tess";

const TessPage = () => {
  const navigate = useNavigate();

  // Animation variants
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: { staggerChildren: 0.2 },
    },
  };

  const cardVariants = {
    hidden: { opacity: 0, y: 30 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.6 } },
  };

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
          TESS Dataset Details
        </motion.h1>

        <motion.p
          className="text-lg md:text-2xl text-white/80 max-w-full leading-relaxed"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.3, duration: 0.8 }}
        >
          The Transiting Exoplanet Survey Satellite (TESS) is NASA’s mission to
          monitor nearly the entire sky in search of exoplanets. It observes
          nearby bright stars, detecting tiny dips in brightness when planets
          transit in front of them. This dataset provides planetary and stellar
          parameters derived from these observations.
        </motion.p>

        {/* Basic Parameters */}
        <div className="w-full">
          <h2 className="text-4xl font-semibold mb-4">📡 Basic Parameters</h2>
          <motion.div
            className="grid grid-cols-1 md:grid-cols-2 gap-6"
            variants={containerVariants}
            initial="hidden"
            animate="visible"
          >
            {tessParameters.basic.map((param) => (
              <motion.div
                key={param.name}
                className="p-4 rounded-lg border border-white/20 backdrop-blur-md"
                variants={cardVariants}
                whileHover={{
                  scale: 1.05,
                  boxShadow: "0 0 20px rgba(0,150,255,0.5)",
                }}
              >
                <h4 className="text-3xl font-semibold mb-1">
                  {param.name} {param.unit && <span>({param.unit})</span>}
                </h4>
                <p className="text-white/80 text-2xl">{param.description}</p>
                {param.min !== null && param.max !== null && (
                  <p className="text-xs text-white/50 mt-1">
                    Range: {param.min} – {param.max}
                  </p>
                )}
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>
    </div>
  );
};

export default TessPage;
