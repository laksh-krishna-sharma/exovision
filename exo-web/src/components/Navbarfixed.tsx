import React from "react";
import { Button } from "@/components/ui/button";

interface NavbarProps {
  logout: () => void;
}

const Navbarfixed: React.FC<NavbarProps> = ({ logout }) => {
  return (
    <div className="fixed top-0 left-0 w-full bg-black text-white z-50 shadow-md">
      <div className="flex justify-between items-center px-4 py-2 md:px-6 md:py-4">
        {/* Left side - Title */}
        <div className="text-lg md:text-xl font-semibold">Exovision</div>

        {/* Right side - Logout button */}
        <Button
          variant="destructive"
          onClick={logout}
          className="text-sm md:text-base px-3 py-1 md:px-4 md:py-2"
        >
          Logout
        </Button>
      </div>
    </div>
  );
};

export default Navbarfixed;
