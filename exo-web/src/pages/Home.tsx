// src/pages/HomePage.tsx
import { useSelector, useDispatch } from "react-redux";
import type { RootState } from "@/store/index";
import { useNavigate } from "react-router-dom";
import { logout } from "@/store/slices/auth/loginSlice"; 
import Navbar from "@/components/Navbar";

const HomePage = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { user } = useSelector((state: RootState) => state.loginData) as { user: { username?: string } | { username?: string }[] }; // adjust type as needed

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-[#020617] text-white">
      <Navbar dispatch={dispatch} logout={logout} />
      
      <h1 className="text-3xl font-bold mb-6">
        Welcome back, {Array.isArray(user) ? (user[0]?.username || "User") : (user?.username || "User")} 
      </h1>

      <div className="flex gap-4">
        <button
          onClick={() => navigate("/prediction")}
          className="px-6 py-2 rounded-lg bg-white text-blue-900 font-medium hover:bg-gray-200 transition"
        >
          Prediction
        </button>
        <button
          onClick={() => navigate("/info")}
          className="px-6 py-2 rounded-lg bg-white text-blue-900 font-medium hover:bg-gray-200 transition"
        >
          Info
        </button>
      </div>

      {/* Quote at the bottom */}
      <div className="absolute bottom-1/3 w-full flex justify-center">
        <blockquote className="text-lg italic text-white/80 text-center max-w-xl">
          “Where science meets stars — predicting the planets beyond.”
        </blockquote>
      </div>
    </div>
  );
};

export default HomePage;