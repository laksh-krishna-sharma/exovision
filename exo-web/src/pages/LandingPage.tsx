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
        <h1 className="text-4xl font-bold text-white pointer-events-auto">
          Exovision
        </h1>
        <p className="text-gray-200 max-w-xl text-center pointer-events-auto">
          Landing page for Exovision. Please login or sign up to continue.
        </p>

        {isAuthenticated ? (
          <div className="flex flex-col items-center gap-3 pointer-events-auto">
            <div className="flex gap-3">
              <Button onClick={() => navigate("/dashboard")}>Go to Dashboard</Button>
              <Button variant="destructive" onClick={() => dispatch(logout())}>
                Logout
              </Button>
            </div>
          </div>
        ) : (
          <div className="flex gap-3 pointer-events-auto">
            <Button onClick={() => navigate("/login")}>Login</Button>
            <Button variant="outline" onClick={() => navigate("/signup")}>
              Sign up
            </Button>
          </div>
        )}
      </div>
    </div>
  );
};

export default LandingPage;
