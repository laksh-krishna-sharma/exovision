import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useAppDispatch } from "@/store";
import { signup } from "@/store/slices/auth/signupSlice";
import { login } from "@/store/slices/auth/loginSlice";
import SpaceBackground from "@/components/spacebackground";
import { motion } from "framer-motion";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const SignupPage = () => {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirm, setConfirm] = useState("");
  const dispatch = useAppDispatch();
  const navigate = useNavigate();

  const handleSignup = async () => {
  const trimmedName = name.trim();
  const trimmedEmail = email.trim().toLowerCase();
    if (!trimmedName || !trimmedEmail || !password || !confirm) {
      return toast.error("Please fill all fields");
    }
    if (password !== confirm) {
      return toast.error("Passwords do not match");
    }
    if (password.length < 8) {
      return toast.error("Password must be at least 8 characters long");
    }
    if (password.length > 128) {
      return toast.error("Password must be 128 characters or fewer");
    }

    try {
      console.log('Starting signup process...');
      const signupResult = await dispatch(
        signup({ name: trimmedName, email: trimmedEmail, password })
      );
      
      if (signup.fulfilled.match(signupResult)) {
        console.log('Signup successful, attempting login...');
        toast.success("Signup successful! Logging you in...");

        const loginResult = await dispatch(
          login({ email: trimmedEmail, password })
        );
        
        if (login.fulfilled.match(loginResult)) {
          console.log('Login successful, navigating to home...');
          toast.success("Welcome to Exovision!");
          navigate("/home");
        } else {
          console.error('Login failed after signup:', loginResult);
          toast.error("Signup successful but login failed. Please login manually.");
          navigate("/login");
        }
      } else {
        console.error('Signup failed:', signupResult);
        const errorMessage = typeof signupResult.payload === 'string' 
          ? signupResult.payload 
          : "Signup failed. Please try again.";
        toast.error(errorMessage);
      }
    } catch (err) {
      console.error('Signup error:', err);
      toast.error("Something went wrong. Please try again.");
    }
  };

  // Card hover tilt logic
  const [cardRotate, setCardRotate] = useState({ x: 0, y: 0 });
  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const x = ((e.clientX - rect.left) / rect.width - 0.5) * 10;
    const y = -((e.clientY - rect.top) / rect.height - 0.5) * 10;
    setCardRotate({ x, y });
  };
  const handleMouseLeave = () => setCardRotate({ x: 0, y: 0 });

  return (
    <div className="relative min-h-screen flex flex-col md:flex-row items-center justify-center p-6 overflow-hidden">
      {/* Background */}
      <SpaceBackground />

      {/* Left: Signup Card (same style as LoginPage) */}
      <motion.div
        style={{ transformPerspective: 1000 }}
        onMouseMove={handleMouseMove}
        onMouseLeave={handleMouseLeave}
        initial={{ scale: 0.5, opacity: 0 }}
        animate={{
          scale: 1,
          opacity: 1,
          rotateX: cardRotate.x,
          rotateY: cardRotate.y,
        }}
        transition={{ duration: 0.9, ease: [0.16, 1, 0.3, 1] }}
        className="relative w-full md:w-1/2 max-w-md p-8 z-10
                   bg-transparent border border-white/10 rounded-xl
                   backdrop-blur-lg shadow-[0_0_20px_rgba(255,255,255,0.1)] mb-10 md:mb-0"
      >
        <motion.h1
          initial={{ y: -20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ duration: 1, type: "spring", stiffness: 100 }}
          className="text-4xl font-bold text-white text-center mb-2"
        >
          Exovision
        </motion.h1>

        <p className="text-white/60 text-center mb-6">
          Explore the universe of exoplanets 🚀
        </p>

        <h2 className="mb-6 text-2xl font-semibold text-white text-center">
          Sign Up
        </h2>

        <form
          className="flex flex-col gap-4"
          onSubmit={(e) => {
            e.preventDefault();
            handleSignup();
          }}
        >
          <Input
            value={name}
            onChange={(e) => setName(e.target.value)}
            type="text"
            placeholder="Name"
            className="bg-white/5 text-white placeholder-white/50 border border-white/20
                       hover:shadow-[0_0_30px_rgba(0,150,255,0.5)] transition-shadow"
          />
          <Input
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            type="email"
            placeholder="Email"
            className="bg-white/5 text-white placeholder-white/50 border border-white/20
                       hover:shadow-[0_0_30px_rgba(0,150,255,0.5)] transition-shadow"
          />
          <Input
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            type="password"
            placeholder="Password"
            className="bg-white/5 text-white placeholder-white/50 border border-white/20
                       hover:shadow-[0_0_30px_rgba(0,150,255,0.5)] transition-shadow"
          />
          <Input
            value={confirm}
            onChange={(e) => setConfirm(e.target.value)}
            type="password"
            placeholder="Confirm password"
            className="bg-white/5 text-white placeholder-white/50 border border-white/20
                       hover:shadow-[0_0_30px_rgba(0,150,255,0.5)] transition-shadow"
          />

          <Button
            type="submit"
            className="bg-white/10 text-white hover:bg-white/20 border border-white/20 
                       hover:shadow-[0_0_40px_rgba(0,200,255,0.7)] transition-shadow"
          >
            Sign Up
          </Button>

          <div className="text-sm text-center text-white/70 mt-2">
            Already have an account?{" "}
            <button
              type="button"
              onClick={() => navigate("/login")}
              className="underline underline-offset-2"
            >
              Login
            </button>
          </div>
        </form>
      </motion.div>

      {/* Right: Exoplanet Info (unchanged) */}
      <motion.div
        initial={{ y: "100vh", opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 1, ease: "easeOut" }}
        className="w-full md:w-1/2 flex flex-col items-center justify-center text-white text-center space-y-10 px-4 md:px-10"
      >
        {/* Section 1 */}
        <div>
          <h2 className="mb-4 text-3xl md:text-5xl font-bold">Exoplanets</h2>
          <p className="text-white/80 leading-relaxed text-base md:text-lg max-w-3xl mx-auto">
            An exoplanet is any planet beyond our solar system. Most of them
            orbit other stars, but some free-floating exoplanets, called rogue
            planets, are untethered to any star. We’ve confirmed nearly 6,000
            exoplanets, out of the billions that we believe exist.
          </p>
        </div>

        {/* Section 2 */}
        <div>
          <h3 className="mb-6 text-2xl md:text-3xl font-semibold">
            Types of Exoplanets
          </h3>
          <img
            src="/Exoplanettypes.png"
            alt="Types of Exoplanets"
            className="rounded-xl mx-auto max-h-64 md:max-h-80 object-contain shadow-lg"
          />
        </div>

        {/* Section 3 */}
        <div className="text-left max-w-3xl space-y-4">
          <p className="text-white/80 text-sm md:text-lg leading-relaxed">
            <span className="block mb-3">
              <span className="font-semibold text-white">Gas Giants:</span>{" "}
              Planets the size of Saturn or Jupiter, or much larger. Some are
              "hot Jupiters" orbiting very close to their stars, reaching
              scorching temperatures.
            </span>

            <span className="block mb-3">
              <span className="font-semibold text-white">Neptunian Planets:</span>{" "}
              Similar in size to Neptune or Uranus, with atmospheres dominated
              by hydrogen and helium and rocky cores.
            </span>

            <span className="block mb-3">
              <span className="font-semibold text-white">Super-Earths:</span>{" "}
              Rocky worlds, more massive than Earth but lighter than Neptune,
              with or without atmospheres.
            </span>

            <span className="block">
              <span className="font-semibold text-white">Terrestrial Planets:</span>{" "}
              Earth-sized or smaller rocky planets, made of silicate, water, or
              carbon. Some may host atmospheres, oceans, or even conditions
              suitable for life.
            </span>
          </p>
        </div>
      </motion.div>
    </div>
  );
};

export default SignupPage;
