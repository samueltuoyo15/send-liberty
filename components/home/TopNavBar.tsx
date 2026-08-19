"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { useMe } from "@/hooks/useAuth";

export default function TopNavBar() {
  const [mounted, setMounted] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const { data: user } = useMe();

  useEffect(() => {
    const timer = setTimeout(() => setMounted(true), 0);
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };
    window.addEventListener("scroll", handleScroll);
    return () => {
      clearTimeout(timer);
      window.removeEventListener("scroll", handleScroll);
    };
  }, []);

  return (
    <header 
      className={`w-full fixed top-0 z-50 transition-all duration-300 ${
        isScrolled ? "shadow-sm" : ""
      }`}
      style={{ 
        backgroundColor: isScrolled ? 'rgba(2, 4, 3, 0.75)' : 'transparent', 
        backdropFilter: isScrolled ? 'blur(16px)' : 'blur(0px)', 
        WebkitBackdropFilter: isScrolled ? 'blur(16px)' : 'blur(0px)' 
      }}
    >
      <nav className="flex justify-between items-center px-margin-mobile md:px-margin-desktop py-md max-w-7xl mx-auto">
        <Link 
          href="/" 
          className="flex items-center gap-2 transition-colors duration-300"
        >
          <span className="text-xl font-headline-md font-bold tracking-tight text-white">Sendlib</span>
        </Link>
        <div className="hidden md:flex items-center gap-xl">
          <Link 
            href="#features" 
            className="font-body-md text-body-md text-white/80 hover:text-white transition-colors duration-300"
          >
            Features
          </Link>
          <Link 
            href="#about-oauth" 
            className="font-body-md text-body-md text-white/80 hover:text-white transition-colors duration-300"
          >
            About
          </Link>
          <Link 
            href="/docs" 
            className="font-body-md text-body-md text-white/80 hover:text-white transition-colors duration-300"
          >
            API Docs
          </Link>
        </div>
        <div className="flex items-center gap-md">
          {mounted && user ? (
            <Link 
              href="/dashboard" 
              className="px-lg py-sm rounded-xl font-label-sm text-label-sm transition-all duration-300 active:scale-95 inline-block bg-primary-sendlib text-on-primary hover:bg-primary-sendlib/90"
            >
              Dashboard
            </Link>
          ) : (
            <>
              <Link 
                href="/login" 
                className="hidden sm:block font-label-sm text-label-sm transition-all duration-300 active:scale-95 px-lg py-sm text-white/80 hover:text-white"
              >
                Login
              </Link>
              <Link 
                href="/login" 
                className="px-lg py-sm rounded-xl font-label-sm text-label-sm transition-all duration-300 active:scale-95 inline-block bg-primary-sendlib text-on-primary hover:bg-primary-sendlib/90"
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
