import PlanetScene from "@/components/planetscene";
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";
import { useAppDispatch, useAppSelector } from "@/store/index";
import { logout } from "@/store/slices/auth/loginSlice";

const LandingPage = () => {
  const navigate = useNavigate();
  const dispatch = useAppDispatch();
  const { access_token } = useAppSelector((state) => state.loginData);
  const isAuthenticated = !!access_token;

  return (
    <div className="relative w-full h-screen overflow-hidden">
      {/* 3D Planet Background */}
      <div className="absolute inset-0 z-0">
        <PlanetScene />
      </div>

      {/* Overlay Content */}
      <div className="relative z-10 flex flex-col items-center justify-center min-h-screen gap-6 p-6 pointer-events-none">
        <h1 className="text-4xl font-bold text-white md:text-6xl pointer-events-auto">
          Exovision
        </h1>

        {isAuthenticated ? (
          <div className="flex flex-col items-center gap-3 pointer-events-auto">
            <div className="flex gap-3">
              <Button
                onClick={() => navigate("/home")}
                className="bg-black/10 text-white hover:bg-black/20 border border-white/20 
             hover:shadow-[0_0_30px_rgba(0,150,255,0.5)] transition-shadow"
              >
                Go to Home
              </Button>

              <Button
                onClick={() => dispatch(logout())}
                className="bg-red-500/20 text-red-300 hover:bg-red-500/30 border border-red-500/30 
             hover:shadow-[0_0_30px_rgba(255,50,50,0.5)] transition-shadow"
              >
                Logout
              </Button>
            </div>
          </div>
        ) : (
          <div className="flex gap-3 pointer-events-auto">
            <Button
              onClick={() => navigate("/login")}
              className="bg-black/10 text-white hover:bg-black/20 border border-white/20 
                         hover:shadow-[0_0_30px_rgba(0,150,255,0.5)] transition-shadow"
            >
              Start now
            </Button>
          </div>
        )}
      </div>
    </div>
  );
};

export default LandingPage;