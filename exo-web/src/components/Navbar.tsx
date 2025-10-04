import React from "react";
import { Link, useLocation } from "react-router-dom";
import { Button } from "@/components/ui/button";

interface NavbarProps {
  logout?: () => void;
}

const Navbar: React.FC<NavbarProps> = ({ logout }) => {
  const location = useLocation();
  return (
    <div className="fixed top-0 left-0 w-full bg-black text-white z-50 shadow-md">
      <div className="flex justify-between items-center px-4 py-2 md:px-6 md:py-4">
        {/* Left side - Title */}
        <Link to="/home">
          <span className="text-lg md:text-xl font-semibold text-cyan-300 hover:text-cyan-400 transition cursor-pointer">
            Exovision
          </span>
        </Link>

        {/* Center - Buttons */}
        <div className="flex items-center gap-4">
          <Link to="/prediction">
            <Button
              variant="ghost"
              className={`text-sm md:text-base transition cursor-pointer hover:underline hover:bg-transparent hover:text-white ${
                location.pathname === "/prediction" ? "underline" : ""
              }`}
            >
              Find Exoplanets
            </Button>
          </Link>
          <Link to="/documentation">
            <Button
              variant="ghost"
              className={`text-sm md:text-base transition cursor-pointer hover:underline hover:bg-transparent hover:text-white ${
                location.pathname === "/documentation" ? "underline" : ""
              }`}
            >
              Documentation
            </Button>
          </Link>
        </div>

        {/* Right side - Logout button */}
        {logout && (
          <Button
            variant="destructive"
            onClick={logout}
            className="text-sm md:text-base px-3 py-1 md:px-4 md:py-2 cursor-pointer"
          >
            Logout
          </Button>
        )}
      </div>
    </div>
  );
};

export default Navbar;
