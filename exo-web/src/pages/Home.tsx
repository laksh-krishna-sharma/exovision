// src/pages/HomePage.tsx
import { useSelector, useDispatch } from "react-redux";
import type { RootState } from "@/store/index";
import { useNavigate } from "react-router-dom";
import { logout } from "@/store/slices/auth/loginSlice";
import Navbarfixed from "@/components/Navbarfixed";
import SpaceBackground from "@/components/spacebackground";
import { motion } from "framer-motion";

// Animation Variants
const fadeInLeft = {
  hidden: { opacity: 0, x: -80 },
  visible: (delay = 0) => ({
    opacity: 1,
    x: 0,
    transition: { duration: 0.8, delay },
  }),
};
const fadeInRight = {
  hidden: { opacity: 0, x: 80 },
  visible: (delay = 0) => ({
    opacity: 1,
    x: 0,
    transition: { duration: 0.8, delay },
  }),
};
const fadeInUp = {
  hidden: { opacity: 0, y: 60 },
  visible: (delay = 0) => ({
    opacity: 1,
    y: 0,
    transition: { duration: 0.8, delay },
  }),
};
const fadeInDown = {
  hidden: { opacity: 0, y: -60 },
  visible: (delay = 0) => ({
    opacity: 1,
    y: 0,
    transition: { duration: 0.8, delay },
  }),
};

const HomePage = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { user } = useSelector(
    (state: RootState) => state.loginData
  ) as { user: { username?: string } | { username?: string }[] };

  return (
    <div className="relative min-h-screen text-white overflow-hidden flex flex-col">
      {/* Background */}
      <div className="absolute inset-0 -z-10">
        <SpaceBackground />
      </div>

      {/* ✅ Navbar fixed at top */}
      <nav className="fixed top-0 left-0 w-full z-50 bg-transparent">
        <Navbarfixed
          logout={() => {
            dispatch(logout());
            navigate("/");
          }}
        />
      </nav>

      {/* Hero + About the Project fullscreen */}
      <section className="flex flex-col md:flex-row items-center justify-center min-h-screen px-6 pt-24 gap-12">
        {/* About the Project (now left) */}
        <motion.div
          className="flex-1 text-left max-w-lg"
          variants={fadeInLeft}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          custom={0.2}
        >
          <h2 className="text-3xl md:text-4xl font-bold mb-6"> About the Project</h2>
          <p className="text-lg md:text-xl text-white/90 leading-relaxed">
            Exoplanet discovery has relied heavily on manual identification from telescope data.
            With thousands of stars being observed, manual detection is slow and prone to error.
            Our project uses AI/ML models trained on NASA’s open-source exoplanet datasets to
            automate this process, enabling faster and more accurate detection of exoplanets.
          </p>
        </motion.div>

        {/* Hero (now right) */}
        <motion.div
          className="flex flex-col items-center text-center flex-1"
          variants={fadeInRight}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          custom={0.4}
        >
          <img
            src="/ufo.png"
            alt="Cartoon UFO"
            className="w-24 h-24 sm:w-32 sm:h-32 mb-6 animate-bounce 
                       drop-shadow-[0_0_20px_rgba(0,150,255,0.6)]"
          />
          <h1 className="text-2xl sm:text-3xl md:text-4xl font-bold mb-6">
            Welcome back,{" "}
            {Array.isArray(user)
              ? user[0]?.username || "User"
              : user?.username || "User"}
          </h1>
          <div className="flex flex-col sm:flex-row gap-4">
            <button
              onClick={() => navigate("/prediction")}
              className="px-6 py-2 rounded-lg bg-transparent text-white text-lg md:text-xl
                         border border-white/30 
                         hover:shadow-[0_0_30px_rgba(0,150,255,0.7)] 
                         transition duration-300"
            >
              Prediction
            </button>
          </div>
        </motion.div>
      </section>

      {/* ============ Sections stacked below with reveal animations ============ */}

      {/* How It Works */}
      <motion.section
        className="px-6 sm:px-16 py-20"
        variants={fadeInDown}
        initial="hidden"
        whileInView="visible"
        viewport={{ once: false }}
        custom={0.3}
      >
        <h2 className="text-3xl md:text-4xl font-bold mb-10 text-center"> How It Works</h2>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-8">
          <motion.div
            className="p-6 rounded-xl shadow-lg text-center border border-white/20 backdrop-blur-sm"
            variants={fadeInLeft}
            custom={0.3}
          >
            <h3 className="text-2xl font-semibold mb-3">📡 Data</h3>
            <p className="text-lg md:text-xl">NASA missions (Kepler, TESS) provide open datasets of stellar observations.</p>
          </motion.div>
          <motion.div
            className="p-6 rounded-xl shadow-lg text-center border border-white/20 backdrop-blur-sm"
            variants={fadeInUp}
            custom={0.5}
          >
            <h3 className="text-2xl font-semibold mb-3">🤖 AI/ML</h3>
            <p className="text-lg md:text-xl">Deep learning models trained to detect planetary signatures in light curves.</p>
          </motion.div>
          <motion.div
            className="p-6 rounded-xl shadow-lg text-center border border-white/20 backdrop-blur-sm"
            variants={fadeInRight}
            custom={0.7}
          >
            <h3 className="text-2xl font-semibold mb-3">🌍 Discovery</h3>
            <p className="text-lg md:text-xl">Predictions highlight potential exoplanets for astronomers to confirm.</p>
          </motion.div>
        </div>
      </motion.section>

      {/* Why It Matters */}
      <motion.section
        className="px-6 sm:px-16 py-20 max-w-5xl mx-auto text-center"
        variants={fadeInUp}
        initial="hidden"
        whileInView="visible"
        viewport={{ once: false }}
        custom={0.4}
      >
        <h2 className="text-3xl md:text-4xl font-bold mb-6"> Why It Matters</h2>
        <p className="text-xl text-white/90 leading-relaxed mb-4">
          By automating exoplanet detection, we accelerate discoveries and reduce errors.
          This helps astronomers focus on verification and supports the search for Earth-like
          planets that may one day be habitable.
        </p>
      </motion.section>

      {/* Features */}
      <motion.section
        className="px-6 sm:px-16 py-20"
        variants={fadeInDown}
        initial="hidden"
        whileInView="visible"
        viewport={{ once: false }}
        custom={0.5}
      >
        <h2 className="text-3xl md:text-4xl font-bold mb-10 text-center"> Features</h2>
        <ul className="grid grid-cols-1 sm:grid-cols-2 gap-8 max-w-4xl mx-auto text-left text-lg md:text-xl">
          <motion.li className="p-5 rounded-lg border border-white/20 backdrop-blur-sm" variants={fadeInLeft} custom={0.3}>
            🚀 Automated detection of exoplanets
          </motion.li>
          <motion.li className="p-5 rounded-lg border border-white/20 backdrop-blur-sm" variants={fadeInRight} custom={0.5}>
            🔬 High accuracy using NASA data
          </motion.li>
          <motion.li className="p-5 rounded-lg border border-white/20 backdrop-blur-sm" variants={fadeInLeft} custom={0.7}>
            📊 Interactive prediction tool
          </motion.li>
          <motion.li className="p-5 rounded-lg border border-white/20 backdrop-blur-sm" variants={fadeInRight} custom={0.9}>
            🌌 Visualization of stellar light curves
          </motion.li>
        </ul>
      </motion.section>

      

      {/* Future Scope */}
      <motion.section
        className="px-6 sm:px-16 py-20 max-w-5xl mx-auto text-center"
        variants={fadeInDown}
        initial="hidden"
        whileInView="visible"
        viewport={{ once: false }}
        custom={0.7}
      >
        <h2 className="text-3xl md:text-4xl font-bold mb-6"> Future Scope</h2>
        <p className="text-xl text-white/90 leading-relaxed">
          We aim to expand our model to cover new missions like James Webb, classify
          planets by type and habitability, and collaborate with astronomers for
          real-world validation and discovery.
        </p>
      </motion.section>

      {/* Quote */}
      <footer className="w-full flex justify-center px-4 py-16">
        <blockquote className="text-xl sm:text-2xl italic text-white/80 text-center max-w-2xl leading-relaxed">
          “Where science meets stars — predicting the planets beyond.”
        </blockquote>
      </footer>
    </div>
  );
};

export default HomePage;
