import { useState } from "react";
import { useNavigate } from "react-router-dom";
import SpaceBackground from "@/components/spacebackground";
import { planetParameters } from "@/components/Datasetsinfo/kepler";
import { tessParameters } from "@/components/Datasetsinfo/tess";
import Navbar from "@/components/Navbar";
import { useDispatch } from "react-redux";
import { logout } from "@/store/slices/auth/loginSlice";

const DocumentationPage = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const [activeTab, setActiveTab] = useState<"kepler" | "tess">("kepler");

  return (
    <div className="relative min-h-screen text-white overflow-x-hidden flex flex-col">
      {/* Background */}
      <div className="absolute inset-0 -z-10">
        <SpaceBackground />
      </div>

      {/* Navbar */}
      <Navbar logout={() => {
        dispatch(logout());
        navigate("/");
      }} />

      {/* Content */}
      <section className="flex flex-col items-start justify-start min-h-screen px-6 sm:px-16 pt-28 space-y-10 pb-20">
        {/* Tabs */}
        <div className="flex border border-white/20 rounded-lg overflow-hidden mb-6 w-fit">
          <button
            onClick={() => setActiveTab("kepler")}
            className={`px-8 py-3 text-sm md:text-base font-medium transition cursor-pointer ${
              activeTab === "kepler"
                ? "bg-white text-black"
                : "bg-transparent text-white"
            }`}
          >
            K2 (Kepler)
          </button>
          <div className="w-px bg-white/20"></div>
          <button
            onClick={() => setActiveTab("tess")}
            className={`px-8 py-3 text-sm md:text-base font-medium transition cursor-pointer ${
              activeTab === "tess"
                ? "bg-white text-black"
                : "bg-transparent text-white"
            }`}
          >
            TESS
          </button>
        </div>

        {/* Model Heading */}
        <h1
          className="text-4xl md:text-5xl font-bold mb-4"
        >
          {activeTab === "kepler" ? "K2 (Kepler) Dataset Details" : "TESS Dataset Details"}
        </h1>

        {/* Tab Content */}
        {activeTab === "kepler" && (
          <div>
            <p
              className="text-lg md:text-2xl text-white/80 max-w-full leading-relaxed mb-10"
            >
              The Kepler mission observed 150,000 stars in a fixed patch of sky for 4 years,
              producing high-quality light curves that led to thousands of exoplanet discoveries.
              These datasets contain light curves — measurements of a star’s brightness
              over time. By analyzing these dips in brightness, we identify potential exoplanets.
            </p>

            {/* Basic Parameters */}
            <div className="w-full">
              <h2 className="text-4xl font-semibold mb-4">📡 Basic Parameters</h2>
              <div
                className="grid grid-cols-1 md:grid-cols-2 gap-6"
              >
                {planetParameters.basic.map((param) => (
                  <div
                    key={param.name}
                    className="p-4 rounded-lg border border-white/20 backdrop-blur-md"
                  >
                    <h4 className="text-3xl font-semibold mb-1">{param.name}</h4>
                    <p className="text-white/80 text-2xl">{param.description}</p>
                  </div>
                ))}
              </div>
            </div>

            {/* KOI / Technical Parameters */}
            <div className="w-full mt-10">
              <h2 className="text-4xl font-semibold text-cyan-300 mb-4">KOI / Technical Parameters</h2>
              <div
                className="grid grid-cols-1 md:grid-cols-2 gap-6"
              >
                {planetParameters.koi.map((param) => (
                  <div
                    key={param.name}
                    className="p-4 rounded-lg border border-white/20 backdrop-blur-md"
                  >
                    <h4 className="text-3xl font-semibold mb-1">{param.name}</h4>
                    <p className="text-white/80 text-2xl">{param.description}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {activeTab === "tess" && (
          <div>
            <p
              className="text-lg md:text-2xl text-white/80 max-w-full leading-relaxed mb-10"
            >
              The Transiting Exoplanet Survey Satellite (TESS) is NASA’s mission to
              monitor nearly the entire sky in search of exoplanets. It observes
              nearby bright stars, detecting tiny dips in brightness when planets
              transit in front of them. This dataset provides planetary and stellar
              parameters derived from these observations.
            </p>

            {/* Basic Parameters */}
            <div className="w-full">
              <h2 className="text-4xl font-semibold mb-4">📡 Basic Parameters</h2>
              <div
                className="grid grid-cols-1 md:grid-cols-2 gap-6"
              >
                {tessParameters.basic.map((param) => (
                  <div
                    key={param.name}
                    className="p-4 rounded-lg border border-white/20 backdrop-blur-md"
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
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}
      </section>
    </div>
  );
};

export default DocumentationPage;