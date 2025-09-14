import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useAppDispatch } from "@/store";
import { signup } from "@/store/slices/auth/signupSlice";
import { login } from "@/store/slices/auth/loginSlice";
import SpaceBackground from "@/components/spacebackground";
import { motion } from "framer-motion";

const SignupPage = () => {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirm, setConfirm] = useState("");
  const dispatch = useAppDispatch();
  const navigate = useNavigate();

  const handleSignup = async () => {
    if (!name || !email || !password || !confirm) {
      return alert("Please fill all fields");
    }
    if (password !== confirm) {
      return alert("Passwords do not match");
    }

    try {
      const result = await dispatch(signup({ name, email, password }));
      if (signup.fulfilled.match(result)) {
        await dispatch(login({ email, password }));
        navigate("/");
      } else {
        alert((result.payload as string) || "Signup failed");
      }
    } catch (err) {
      console.error(err);
      alert("Something went wrong");
    }
  };

  return (
    <div className="relative min-h-screen flex items-center justify-center p-6 overflow-hidden">
      {/* 2D Star Background */}
      <SpaceBackground />

      {/* Signup Form with slide-in animation */}
      <motion.div
        initial={{ y: "100vh", opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.8, ease: "easeOut" }}
        className="relative w-full max-w-md p-8 z-10
                   bg-transparent border border-white/10 rounded-xl
                   backdrop-blur-lg shadow-[0_0_20px_rgba(255,255,255,0.1)]"
      >
        <h2 className="mb-6 text-2xl font-semibold text-white text-center">
          Create account
        </h2>

        <div className="flex flex-col gap-4">
          <Input
            value={name}
            onChange={(e) => setName(e.target.value)}
            type="text"
            placeholder="Name"
            className="bg-white/5 text-white placeholder-white/50 border border-white/20"
          />
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
          <Input
            value={confirm}
            onChange={(e) => setConfirm(e.target.value)}
            type="password"
            placeholder="Confirm password"
            className="bg-white/5 text-white placeholder-white/50 border border-white/20"
          />

          <Button
            onClick={handleSignup}
            className="bg-white/10 text-white hover:bg-white/20 border border-white/20"
          >
            Sign up
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
        </div>
      </motion.div>
    </div>
  );
};

export default SignupPage;