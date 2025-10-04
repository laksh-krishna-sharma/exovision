import { useSelector, useDispatch } from "react-redux";
import type { RootState } from "@/store/index";
import { useNavigate } from "react-router-dom";
import { logout } from "@/store/slices/auth/loginSlice";
import Navbar from "@/components/Navbar";
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

      {/* Navbar */}
      <nav className="fixed top-0 left-0 w-full z-50 bg-transparent">
        <Navbar
          logout={() => {
            dispatch(logout());
            navigate("/");
          }}
        />
      </nav>

  {/* ================= Hero Section ================= */}
  <section className="flex flex-col items-start justify-start min-h-screen px-6 sm:px-12 pt-28 pb-16 gap-8 text-left">
        {/* About Section */}
        <motion.div
          className="w-full text-left"
          variants={fadeInLeft}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          custom={0.2}
        >
          <h2 className="text-5xl md:text-6xl font-extrabold mb-6 tracking-tight">
            Unveiling New Worlds
          </h2>
          <p className="text-xl md:text-2xl text-white/90 leading-relaxed font-medium">
            The universe is teeming with countless stars, many with planets of their own. Sifting through this cosmic data has been a slow, manual process prone to error. Our project leverages cutting-edge AI to automate the search, making the discovery of distant worlds faster and more accurate than ever. By analyzing light curves from telescopes like Kepler and TESS, our advanced machine learning models can detect the subtle dips in brightness that indicate an exoplanet transiting its host star. This not only speeds up the identification process but also reduces human error, allowing astronomers to focus on the most promising candidates for further study. Join us in this exciting journey to explore the cosmos and uncover the secrets of distant worlds.
          </p>
        </motion.div>

        {/* Hero Section */}
        <motion.div
          className="flex flex-col items-center justify-center w-full max-w-5xl mt-auto mb-auto self-center text-center"
          variants={fadeInRight}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          custom={0.4}
        >
          <h1 className="text-6xl sm:text-7xl md:text-8xl font-extrabold mb-6 tracking-tight">
            Welcome,{" "}
            <span className="text-cyan-300">
              {Array.isArray(user)
                ? user[0]?.username || "Explorer"
                : user?.username || "Explorer"}
            </span>
          </h1>
          <p className="text-2xl md:text-3xl text-white/90 mb-10 font-medium leading-snug">
            Ready to discover the unknown?
          </p>
          <button
            onClick={() => navigate("/prediction")}
            className="px-10 py-4 rounded-lg bg-transparent text-white text-xl md:text-2xl
                       border-2 border-white/50 
                       hover:bg-white/10 hover:border-white
                       hover:shadow-[0_0_36px_rgba(0,150,255,0.8)] 
                       transition-all duration-300 self-center font-semibold"
          >
            Find Exoplanets
          </button>
        </motion.div>
      </section>

      {/* ================= Future Scope ================= */}
      <motion.section
        className="px-6 sm:px-12 py-24 max-w-5xl mx-auto text-center"
        variants={fadeInUp}
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true }}
        custom={0.7}
      >
        <h2 className="text-5xl md:text-6xl font-extrabold mb-6">
          Charting the Course Ahead
        </h2>
        <p className="text-xl md:text-2xl text-white/90 leading-relaxed font-medium">
          Our journey is just beginning. Future plans include expanding to missions like the
          James Webb Space Telescope, classifying exoplanets by type and habitability, and
          collaborating with astronomers to validate our AI discoveries.
        </p>
      </motion.section>

      {/* ================= Footer Quote ================= */}
      <footer className="w-full flex justify-center px-6 py-24 bg-transparent">
        <blockquote className="text-3xl sm:text-4xl italic text-white/90 text-center max-w-3xl leading-relaxed font-medium">
          “The cosmos is calling. We're building the tools to answer.”
        </blockquote>
      </footer>
    </div>
  );
};

export default HomePage;
