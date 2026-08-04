"use client";

import { HugeiconsIcon } from "@hugeicons/react";
import { useMe } from "@/hooks/useAuth";
import { GithubIcon, ArrowLeft01Icon } from "@hugeicons/core-free-icons";
import { useRouter } from "next/navigation";
import { useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import SEO from "@/components/SEO";

export default function LoginPage() {
  const { data: user, isLoading } = useMe();
  const router = useRouter();

  useEffect(() => {
    if (!isLoading && user) {
      router.push("/dashboard");
    }
  }, [isLoading, user, router]);

  if (isLoading || user) {
    return (
      <div className="min-h-screen bg-background-sendlib flex flex-col items-center justify-center">
        <div className="flex flex-col items-center gap-3">
          <div className="h-9 w-9 rounded-full border-2 border-primary-sendlib border-t-transparent animate-spin" />
          <p className="text-sm font-medium text-secondary font-sans animate-pulse">Authenticating...</p>
        </div>
      </div>
    );
  }

  return (
    <SEO title="Login / Sign Up" description="Log in or create a new SendLib account to manage your API keys and SMTP integrations.">
      <div className="min-h-screen grid grid-cols-1 md:grid-cols-2 bg-background-sendlib">
        
        {/* Left side: Login forms (Top on mobile) */}
        <div className="flex flex-col justify-center px-margin-mobile md:px-margin-desktop py-xl relative">
          <Link 
            href="/" 
            className="absolute top-8 left-8 md:left-12 font-label-sm text-label-sm text-secondary hover:text-primary-sendlib flex items-center gap-xs transition-colors"
          >
            <HugeiconsIcon icon={ArrowLeft01Icon} size={20} />
            Back to Home
          </Link>

          <div className="w-full max-w-105 mx-auto space-y-xl">
            <div className="space-y-sm">
              <h1 className="font-headline-lg text-headline-lg text-primary-sendlib">
                Welcome to SendLib
              </h1>
              <p className="font-body-md text-body-md text-on-surface-variant">
                Log in or create an account to manage your API keys, and start sending emails in seconds.
              </p>
            </div>

            <div className="space-y-md">
              <button
                onClick={() => { window.location.href = "/api/auth/github"; }}
                className="w-full font-label-sm text-label-sm bg-primary-sendlib text-white h-12 flex items-center justify-center gap-md rounded-xl transition-transform active:scale-95 hover:bg-primary-sendlib/95 shadow-sm cursor-pointer"
              >
                <HugeiconsIcon icon={GithubIcon} className="w-5 h-5" />
                Continue with GitHub
              </button>

              <button
                onClick={() => { window.location.href = "/api/auth/google"; }}
                className="w-full font-label-sm text-label-sm border border-outline-variant text-on-surface bg-white h-12 flex items-center justify-center gap-md rounded-xl transition-transform active:scale-95 hover:bg-surface-container-low cursor-pointer"
              >
                <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none">
                  <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4"/>
                  <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/>
                  <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05"/>
                  <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"/>
                </svg>
                Continue with Google
              </button>
            </div>

            <p className="font-label-xs text-label-xs text-center text-on-surface-variant max-w-85 mx-auto leading-relaxed">
              By clicking continue, you agree to our{" "}
              <Link href="/terms-of-service" className="underline hover:text-primary-sendlib">Terms of Service</Link>{" "}
              and{" "}
              <Link href="/privacy-policy" className="underline hover:text-primary-sendlib">Privacy Policy</Link>.
            </p>
          </div>
        </div>
        {/* Right side: Hero forest & Character illustration (Hidden on mobile) */}
        <div 
          className="hidden md:flex flex-col justify-between p-8 relative overflow-hidden"
          style={{
            backgroundImage: "linear-gradient(rgba(29, 43, 62, 0.65), rgba(29, 43, 62, 0.65)), url('/forest_background/forest-background.webp')",
            backgroundSize: "cover",
            backgroundPosition: "center",
          }}
        >
          <Link href="/" className="font-headline-md text-headline-md font-bold text-white relative z-10">
            SendLib
          </Link>

          <div className="space-y-md max-w-115 relative z-10">
            <h2 className="font-headline-lg text-headline-lg text-white leading-tight">
              Stop fighting SMTP configuration.
            </h2>
            <p className="font-body-lg text-body-lg text-white/90">
              A secure API designed for developers to send transactional emails instantly from any hosting environment without port restrictions.
            </p>
          </div>

          {/* Character image positioned at the bottom right of the left panel */}
          <div className="absolute right-0 bottom-0 w-80 h-[80%] z-0 select-none pointer-events-none opacity-90 transition-transform duration-700 hover:scale-105">
            <Image 
              src="/forest_background/character.png" 
              alt="Empowerer character" 
              fill
              className="object-contain object-bottom"
            />
          </div>
        </div>


      </div>
    </SEO>
  );
}
