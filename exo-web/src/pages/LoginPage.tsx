import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useAppDispatch } from "@/store/index";
import { login } from "@/store/slices/auth/loginSlice";
import SpaceBackground from "@/components/spacebackground";
import { motion } from "framer-motion";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const LoginPage = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const dispatch = useAppDispatch();
  const navigate = useNavigate();

  const handleLogin = async () => {
  const trimmedEmail = email.trim().toLowerCase();
    if (!trimmedEmail || !password) {
      return toast.error("Enter email and password");
    }

    try {
      console.log('Attempting login...');
      const result = await dispatch(login({ email: trimmedEmail, password }));

      if (login.fulfilled.match(result)) {
        console.log('Login successful:', result.payload);
        toast.success("Login successful!");
        navigate("/home");
      } else {
        console.error('Login failed:', result);
        const errorMessage = typeof result.payload === 'string' 
          ? result.payload 
          : "Invalid email or password";
        toast.error(errorMessage);
      }
    } catch (error) {
    console.error('Login error:', error);
    toast.error("Login failed. Please try again.");
    }
  };


  // Card hover tilt logic
  const [cardRotate, setCardRotate] = useState({ x: 0, y: 0 });
  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const x = ((e.clientX - rect.left) / rect.width - 0.5) * 10; // max 10deg
    const y = -((e.clientY - rect.top) / rect.height - 0.5) * 10;
    setCardRotate({ x, y });
  };
  const handleMouseLeave = () => setCardRotate({ x: 0, y: 0 });

  return (
    <div className="relative w-full h-screen overflow-hidden flex items-center justify-center">
      {/* Backgrounds */}
      <SpaceBackground />
      {/* <SpaceObjects /> */}

      {/* Login Card */}
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
        className="relative w-full max-w-md p-8 z-10
                   bg-transparent border border-white/10 rounded-xl
                   backdrop-blur-lg shadow-[0_0_20px_rgba(255,255,255,0.1)]"
      >
        {/* Animated Title */}
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

        <h2 className="mb-6 text-2xl font-semibold text-white text-center">Login</h2>

        <form
          className="flex flex-col gap-4"
          onSubmit={(e) => {
            e.preventDefault();
            handleLogin();
          }}
        >
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

          {/* Button with glow shadow */}
          <Button
            type="submit"
            className="bg-white/10 text-white hover:bg-white/20 border border-white/20 
                       hover:shadow-[0_0_40px_rgba(0,200,255,0.7)] transition-shadow"
          >
            Login
          </Button>

          <div className="text-sm text-center text-white/70 mt-2">
            Don’t have an account?{" "}
            <button
              type="button"
              onClick={() => navigate("/signup")}
              className="underline underline-offset-2"
            >
              Sign up
            </button>
          </div>
        </form>
      </motion.div>

      {/* Footer Fun Fact */}
      <p className="absolute bottom-4 text-white/60 text-sm text-center w-full px-4">
        “Over 5,000 exoplanets discovered... maybe you’ll find the next one 🌌”
      </p>
    </div>
  );
};

export default LoginPage;
