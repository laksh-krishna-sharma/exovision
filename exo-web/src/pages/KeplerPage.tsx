// DatasetPage.tsx
import { useNavigate } from "react-router-dom";
import SpaceBackground from "@/components/spacebackground";
import { planetParameters } from "@/components/Datasetsinfo/kepler"; // full parameters
import Navbar from "@/components/Navbar";
import { useDispatch } from "react-redux";
import { logout } from "@/store/slices/auth/loginSlice";

const KeplerPage = () => {
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
          Kepler Dataset Details
        </h1>

        <p
          className="text-lg md:text-2xl text-white/80 max-w-full leading-relaxed"
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
        <div className="w-full">
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
      </section>
    </div>
  );
};

export default KeplerPage;
