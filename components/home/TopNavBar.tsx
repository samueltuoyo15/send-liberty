"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { useMe } from "@/hooks/useAuth";

export default function TopNavBar() {
  const [mounted, setMounted] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const { data: user } = useMe();

  useEffect(() => {
    setMounted(true);
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <header 
      className={`w-full fixed top-0 z-50 transition-all duration-300 border-b ${
        isScrolled ? "border-outline-variant shadow-sm" : "border-transparent"
      }`}
      style={{ 
        backgroundColor: isScrolled ? 'rgba(247, 249, 251, 0.75)' : 'transparent', 
        backdropFilter: isScrolled ? 'blur(16px)' : 'blur(0px)', 
        WebkitBackdropFilter: isScrolled ? 'blur(16px)' : 'blur(0px)' 
      }}
    >
      <nav className="flex justify-between items-center px-margin-mobile md:px-margin-desktop py-md max-w-7xl mx-auto">
        <Link 
          href="/" 
          className={`font-headline-md text-headline-md font-bold transition-colors duration-300 ${
            isScrolled ? "text-primary-sendlib" : "text-white"
          }`}
        >
          SendLib
        </Link>
        <div className="hidden md:flex items-center gap-xl">
          <Link 
            href="#features" 
            className={`font-body-md text-body-md transition-colors duration-300 ${
              isScrolled ? "text-secondary hover:text-primary-sendlib" : "text-white/80 hover:text-white"
            }`}
          >
            Features
          </Link>
          <Link 
            href="#about-oauth" 
            className={`font-body-md text-body-md transition-colors duration-300 ${
              isScrolled ? "text-secondary hover:text-primary-sendlib" : "text-white/80 hover:text-white"
            }`}
          >
            About
          </Link>
          <Link 
            href="/docs" 
            className={`font-body-md text-body-md transition-colors duration-300 ${
              isScrolled ? "text-secondary hover:text-primary-sendlib" : "text-white/80 hover:text-white"
            }`}
          >
            API Docs
          </Link>
        </div>
        <div className="flex items-center gap-md">
          {mounted && user ? (
            <Link 
              href="/dashboard" 
              className={`px-lg py-sm rounded-xl font-label-sm text-label-sm transition-all duration-300 active:scale-95 inline-block ${
                isScrolled 
                  ? "bg-primary-sendlib text-white hover:bg-primary-sendlib/90" 
                  : "bg-white text-primary-sendlib hover:bg-white/90"
              }`}
            >
              Dashboard
            </Link>
          ) : (
            <>
              <Link 
                href="/login" 
                className={`hidden sm:block font-label-sm text-label-sm transition-all duration-300 active:scale-95 px-lg py-sm ${
                  isScrolled ? "text-primary-sendlib" : "text-white/80 hover:text-white"
                }`}
              >
                Login
              </Link>
              <Link 
                href="/login" 
                className={`px-lg py-sm rounded-xl font-label-sm text-label-sm transition-all duration-300 active:scale-95 inline-block ${
                  isScrolled 
                    ? "bg-primary-sendlib text-white hover:bg-primary-sendlib/90" 
                    : "bg-white text-primary-sendlib hover:bg-white/90"
                }`}
              >
                Sign Up
              </Link>
            </>
          )}
        </div>
      </nav>
    </header>
  );
}
