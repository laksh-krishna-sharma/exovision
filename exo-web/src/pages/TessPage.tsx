// src/pages/TessPage.tsx
import { useNavigate } from "react-router-dom";
import SpaceBackground from "@/components/spacebackground";
import { tessParameters } from "@/components/Datasetsinfo/tess";
import Navbar from "@/components/Navbar";
import { useDispatch } from "react-redux";
import { logout } from "@/store/slices/auth/loginSlice";

const TessPage = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();

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
        <h1
          className="text-4xl md:text-5xl font-bold mb-4"
        >
          TESS Dataset Details
        </h1>

        <p
          className="text-lg md:text-2xl text-white/80 max-w-full leading-relaxed"
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
      </section>
    </div>
  );
};

export default TessPage;
