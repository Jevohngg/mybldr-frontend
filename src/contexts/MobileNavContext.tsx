/**
 * MobileNavContext
 *
 * Provides mobile navigation state across the application.
 * Controls the sidebar drawer visibility on mobile/tablet devices.
 */

import React, { createContext, useContext, useState, useCallback, useEffect } from 'react';

interface MobileNavContextType {
  isMobileNavOpen: boolean;
  openMobileNav: () => void;
  closeMobileNav: () => void;
  toggleMobileNav: () => void;
  isMobile: boolean;
  isTablet: boolean;
}

const MobileNavContext = createContext<MobileNavContextType | undefined>(undefined);

export function MobileNavProvider({ children }: { children: React.ReactNode }) {
  const [isMobileNavOpen, setIsMobileNavOpen] = useState(false);
  const [isMobile, setIsMobile] = useState(false);
  const [isTablet, setIsTablet] = useState(false);

  // Check screen size on mount and resize
  useEffect(() => {
    const checkScreenSize = () => {
      const width = window.innerWidth;
      setIsMobile(width < 768);
      setIsTablet(width >= 768 && width < 1024);
    };

    checkScreenSize();
    window.addEventListener('resize', checkScreenSize);
    return () => window.removeEventListener('resize', checkScreenSize);
  }, []);

  // Close mobile nav when screen becomes desktop
  useEffect(() => {
    if (!isMobile && !isTablet) {
      setIsMobileNavOpen(false);
    }
  }, [isMobile, isTablet]);

  // Lock body scroll when mobile nav is open
  useEffect(() => {
    if (isMobileNavOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    return () => {
      document.body.style.overflow = '';
    };
  }, [isMobileNavOpen]);

  const openMobileNav = useCallback(() => {
    setIsMobileNavOpen(true);
  }, []);

  const closeMobileNav = useCallback(() => {
    setIsMobileNavOpen(false);
  }, []);

  const toggleMobileNav = useCallback(() => {
    setIsMobileNavOpen(prev => !prev);
  }, []);

  return (
    <MobileNavContext.Provider
      value={{
        isMobileNavOpen,
        openMobileNav,
        closeMobileNav,
        toggleMobileNav,
        isMobile,
        isTablet,
      }}
    >
      {children}
    </MobileNavContext.Provider>
  );
}

export function useMobileNav() {
  const context = useContext(MobileNavContext);
  if (context === undefined) {
    throw new Error('useMobileNav must be used within a MobileNavProvider');
  }
  return context;
}
