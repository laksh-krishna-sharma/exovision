import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import type { AppDispatch } from '@/store';

interface NavbarProps {
  dispatch: AppDispatch;
  logout: () => void;
}

const Navbar: React.FC<NavbarProps> = ({ logout }) => {
  const [isVisible, setIsVisible] = useState(false);
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 768); // md breakpoint
    };

    checkMobile();
    window.addEventListener('resize', checkMobile);

    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  useEffect(() => {
    if (isMobile) {
      setIsVisible(true); // Always visible on mobile
      return;
    }

    const handleMouseMove = (e: MouseEvent) => {
      if (e.clientY <= 50) {
        setIsVisible(true);
      } else if (e.clientY > 100) {
        setIsVisible(false);
      }
    };

    document.addEventListener('mousemove', handleMouseMove);
    
    return () => {
      document.removeEventListener('mousemove', handleMouseMove);
    };
  }, [isMobile]);

  return (
    <div 
      className={`fixed top-0 left-0 w-full bg-black/60 text-white z-50 transition-transform duration-300 ease-in-out ${
        isVisible ? 'translate-y-0' : '-translate-y-full'
      }`}
    >
      <div className="flex justify-between items-center px-4 py-2 md:px-6 md:py-4">
        {/* Left side - Title */}
        <div className="text-lg md:text-xl font-semibold">
          Exovision
        </div>
        
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

export default Navbar;