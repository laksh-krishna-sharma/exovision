import React, { useState } from "react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";

interface NavbarProps {
  logout?: () => void;
}

const Navbarfixed: React.FC<NavbarProps> = ({ logout }) => {
  const [dropdownOpen, setDropdownOpen] = useState(false);

  return (
    <div className="fixed top-0 left-0 w-full bg-black text-white z-50 shadow-md">
      <div className="flex justify-between items-center px-4 py-2 md:px-6 md:py-4">
        {/* Left side - Title and Dataset dropdown */}
        <div className="flex items-center gap-4 relative">
          <span className="text-lg md:text-xl font-semibold text-cyan-300">
            Exovision
          </span>

          {/* Dataset Dropdown */}
          <div className="relative">
            <button
              onClick={() => setDropdownOpen(!dropdownOpen)}
              className="text-sm md:text-base hover:text-cyan-300 transition flex items-center gap-1"
            >
              Dataset ▼
            </button>

            {/* Dropdown menu */}
            {dropdownOpen && (
              <div className="absolute top-full left-0 mt-1 w-40 bg-black border border-white/20 rounded shadow-lg flex flex-col">
                <Link
                  to="/kepler"
                  className="block px-4 py-2 hover:bg-white/10 transition"
                  onClick={() => setDropdownOpen(false)} // close after click
                >
                  Kepler
                </Link>
                <Link
                  to="/tess"
                  className="block px-4 py-2 hover:bg-white/10 transition"
                  onClick={() => setDropdownOpen(false)} // close after click
                >
                  TESS
                </Link>
              </div>
            )}
          </div>
        </div>

        {/* Right side - Logout button */}
        {logout && (
          <Button
            variant="destructive"
            onClick={logout}
            className="text-sm md:text-base px-3 py-1 md:px-4 md:py-2"
          >
            Logout
          </Button>
        )}
      </div>
    </div>
  );
};

export default Navbarfixed;
