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

      {/* Navbar fixed at top */}
      <nav className="fixed top-0 left-0 w-full z-50 bg-transparent">
        <Navbarfixed
          logout={() => {
            dispatch(logout());
            navigate("/");
          }}
        />
      </nav>

      {/* Hero + About the Project fullscreen */}
      {/* Increased gap and padding for a more spacious feel */}
      <section className="flex flex-col items-center justify-center min-h-screen px-8 lg:px-16 pt-24 gap-16">
        {/* About the Project (top) */}
        <motion.div
          className="w-full text-left" // Full width, left-aligned
          variants={fadeInLeft}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          custom={0.2}
        >
          {/* Larger, bolder heading */}
          <h2 className="text-4xl md:text-5xl font-extrabold mb-6 tracking-tight">
            Unveiling New Worlds
          </h2>
          {/* Larger text with more line spacing for readability, expanded content */}
          <p className="text-xl md:text-2xl text-white/80 leading-relaxed">
            The universe is teeming with countless stars, many with planets of their own. Sifting through this cosmic data has been a slow, manual process prone to error. Our project leverages cutting-edge AI to automate the search, making the discovery of distant worlds faster and more accurate than ever. By analyzing light curves from telescopes like Kepler and TESS, our advanced machine learning models can detect the subtle dips in brightness that indicate an exoplanet transiting its host star. This not only speeds up the identification process but also reduces human error, allowing astronomers to focus on the most promising candidates for further study. Join us in this exciting journey to explore the cosmos and uncover the secrets of distant worlds.
          </p>
        </motion.div>

        {/* Hero (below) */}
        <motion.div
          className="flex flex-col items-center text-center flex-1 w-full"
          variants={fadeInRight}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          custom={0.4}
        >
          <img
            src="/ufo.png"
            alt="Cartoon UFO"
            className="w-28 h-28 sm:w-40 sm:h-40 mb-8 animate-bounce 
                       drop-shadow-[0_0_25px_rgba(0,150,255,0.7)]" // Enhanced drop shadow
          />
          {/* Significantly larger main headline */}
          <h1 className="text-5xl sm:text-6xl md:text-7xl font-bold mb-4 tracking-tight">
            Welcome,{" "}
            <span className="text-cyan-300">
              {Array.isArray(user)
                ? user[0]?.username || "Explorer"
                : user?.username || "Explorer"}
            </span>
          </h1>
          {/* Subtler sub-headline */}
          <p className="text-xl md:text-2xl text-white/70 mb-8">
            Ready to discover the unknown?
          </p>
          <div className="flex flex-col sm:flex-row gap-4">
            {/* Larger, more prominent button */}
            <button
              onClick={() => navigate("/prediction")}
              className="px-8 py-3 rounded-lg bg-transparent text-white text-xl
                         border-2 border-white/40 
                         hover:bg-white/10 hover:border-white
                         hover:shadow-[0_0_30px_rgba(0,150,255,0.7)] 
                         transition-all duration-300"
            >
              Start Prediction
            </button>
          </div>
        </motion.div>
      </section>

      {/* ============ Sections stacked below with reveal animations ============ */}
      
      {/* Increased vertical padding (py) for all sections below */}
      
      {/* How It Works */}
      <motion.section
        className="px-6 sm:px-16 py-28"
        variants={fadeInUp}
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true }}
        custom={0.3}
      >
        {/* Increased heading size and bottom margin */}
        <h2 className="text-4xl md:text-5xl font-bold mb-16 text-center">
          From Starlight to Discovery
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-10 max-w-7xl mx-auto">
          {/* Card styles updated with more padding */}
          <motion.div
            className="p-8 rounded-xl shadow-lg text-center border border-white/20 backdrop-blur-md"
            variants={fadeInLeft}
            custom={0.3}
          >
            <h3 className="text-3xl font-semibold mb-4">📡 Data Ingestion</h3>
            <p className="text-xl leading-relaxed">We harness vast datasets from legendary NASA missions like Kepler and TESS, capturing the light from distant stars.</p>
          </motion.div>
          <motion.div
            className="p-8 rounded-xl shadow-lg text-center border border-white/20 backdrop-blur-md"
            variants={fadeInUp}
            custom={0.5}
          >
            <h3 className="text-3xl font-semibold mb-4">🤖 AI Analysis</h3>
            <p className="text-xl leading-relaxed">Our deep learning models are trained to find the faint, tell-tale dips in starlight that signal a planet passing by.</p>
          </motion.div>
          <motion.div
            className="p-8 rounded-xl shadow-lg text-center border border-white/20 backdrop-blur-md"
            variants={fadeInRight}
            custom={0.7}
          >
            <h3 className="text-3xl font-semibold mb-4">🌍 Planet Identification</h3>
            <p className="text-xl leading-relaxed">The AI highlights potential exoplanets, empowering astronomers to focus on confirming the next new world.</p>
          </motion.div>
        </div>
      </motion.section>

      {/* Why It Matters */}
      <motion.section
        className="px-6 sm:px-16 py-28 max-w-5xl mx-auto text-center"
        variants={fadeInUp}
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true }}
        custom={0.4}
      >
        <h2 className="text-4xl md:text-5xl font-bold mb-8">
          The Quest for Another Earth
        </h2>
        <p className="text-xl md:text-2xl text-white/90 leading-relaxed">
          Every exoplanet is a clue in the grand puzzle of the universe. By accelerating this process, we move closer to answering humanity's oldest question: Are we alone? This project aids the search for habitable, Earth-like worlds, pushing the boundaries of what we know.
        </p>
      </motion.section>

      {/* Features */}
      <motion.section
        className="px-6 sm:px-16 py-28"
        variants={fadeInUp}
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true }}
        custom={0.5}
      >
        <h2 className="text-4xl md:text-5xl font-bold mb-16 text-center">
          Your Toolkit for Exploration
        </h2>
        <ul className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-5xl mx-auto text-left text-xl">
          {/* Larger list items with more padding */}
          <motion.li className="p-8 rounded-lg border border-white/20 backdrop-blur-md" variants={fadeInLeft} custom={0.3}>
            🚀 AI-Powered Detection: Instantly identify potential exoplanets from raw stellar data.
          </motion.li>
          <motion.li className="p-8 rounded-lg border border-white/20 backdrop-blur-md" variants={fadeInRight} custom={0.5}>
            🔬 High-Fidelity Accuracy: Built on trusted, open-source datasets directly from NASA.
          </motion.li>
          <motion.li className="p-8 rounded-lg border border-white/20 backdrop-blur-md" variants={fadeInLeft} custom={0.7}>
            📊 Interactive Predictions: Upload your own data and witness the AI analysis in action.
          </motion.li>
          <motion.li className="p-8 rounded-lg border border-white/20 backdrop-blur-md" variants={fadeInRight} custom={0.9}>
            🌌 Stunning Visualizations: Understand the data with clear and interactive light curve graphs.
          </motion.li>
        </ul>
      </motion.section>

      {/* Future Scope */}
      <motion.section
        className="px-6 sm:px-16 py-28 max-w-5xl mx-auto text-center"
        variants={fadeInUp}
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true }}
        custom={0.7}
      >
        <h2 className="text-4xl md:text-5xl font-bold mb-8">
          Charting the Course Ahead
        </h2>
        <p className="text-xl md:text-2xl text-white/90 leading-relaxed">
          Our journey is just beginning. We aim to expand our model to cover new missions like the James Webb Space Telescope, classify planets by type and habitability, and collaborate with astronomers to turn predictions into confirmed discoveries.
        </p>
      </motion.section>

      {/* Quote */}
      <footer className="w-full flex justify-center px-4 py-24">
        {/* Larger quote text */}
        <blockquote className="text-2xl sm:text-3xl italic text-white/80 text-center max-w-3xl leading-relaxed">
          “The cosmos is calling. We're building the tools to answer.”
        </blockquote>
      </footer>
    </div>
  );
};

export default HomePage;