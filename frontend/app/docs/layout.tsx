"use client";

import Link from "next/link";
import { Mail } from "lucide-react";
import { DocsSidebar } from "@/components/docs/Sidebar";

export default function DocsLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="min-h-screen bg-[#000000] text-[#E0E0E0] font-sans selection:bg-[#333] selection:text-white flex flex-col pt-16">
      {/* Top Navbar specifically for Docs */}
      <nav className="fixed top-0 left-0 right-0 h-16 border-b border-[#222] bg-[#000000]/80 backdrop-blur-md z-50 flex items-center justify-between px-6">
        <div className="flex items-center gap-3">
          <Link href="/" className="flex items-center gap-3 hover:opacity-80 transition-opacity">
             <div className="flex h-8 w-8 items-center justify-center rounded bg-white shadow-sm overflow-hidden">
              <img src="/logo.png" alt="Logo" className="w-full h-full object-cover" />
            </div>
             <span className="font-bold text-lg text-white tracking-tight">SendLiberty <span className="text-[#666] font-normal">Docs</span></span>
          </Link>
        </div>
        <div className="flex items-center gap-4">
          <Link href="/dashboard" className="text-[13px] font-bold px-4 py-2 bg-[#1A1A1A] hover:bg-[#2A2A2A] rounded text-white transition-colors border border-[#333]">
            Back to Dashboard
          </Link>
        </div>
      </nav>

      {/* Main Dual Pane Layout */}
      <div className="flex flex-1 max-w-[1400px] w-full mx-auto">
        <DocsSidebar />
        <main className="flex-1 w-full p-6 md:p-12 lg:p-16 overflow-y-auto max-w-4xl">
          {children}
        </main>
      </div>
    </div>
  );
}
