import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useAppDispatch } from "@/store/index";
import { login } from "@/store/slices/auth/loginSlice";
import SpaceBackground from "@/components/spacebackground";
import { motion } from "framer-motion";

const LoginPage = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const dispatch = useAppDispatch();
  const navigate = useNavigate();

  const handleLogin = () => {
    if (!email || !password) {
      return alert("Please enter email and password");
    }
    dispatch(login({ email, password }));
    navigate("/");
  };

  return (
    <div className="relative w-full h-screen overflow-hidden flex items-center justify-center">
      {/* 2D Space Background */}
      <SpaceBackground />

      {/* Login Form with 3D fly-in animation */}
      <motion.div
        initial={{ scale: 0.5, opacity: 0, z: -500 }}
        animate={{ scale: 1, opacity: 1, z: 0 }}
        transition={{ duration: 0.9, ease: [0.16, 1, 0.3, 1] }} // spring-like bounce
        style={{ transformPerspective: 1000 }}
        className="relative w-full max-w-md p-8 z-10
                   bg-transparent border border-white/10 rounded-xl
                   backdrop-blur-lg shadow-[0_0_20px_rgba(255,255,255,0.1)]"
      >
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
            className="bg-white/5 text-white placeholder-white/50 border border-white/20"
          />
          <Input
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            type="password"
            placeholder="Password"
            className="bg-white/5 text-white placeholder-white/50 border border-white/20"
          />
          <Button
            type="submit"
            className="bg-white/10 text-white hover:bg-white/20 border border-white/20"
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
    </div>
  );
};

export default LoginPage;
