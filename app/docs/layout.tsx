
import Link from "next/link";
import { DocsSidebar } from "@/components/docs/Sidebar";

export default function DocsLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="min-h-screen bg-background-sendlib text-on-background font-sans selection:bg-primary-sendlib/20 selection:text-primary-sendlib flex flex-col pt-16">
      {/* Top Navbar specifically for Docs */}
      <nav className="fixed top-0 left-0 right-0 h-16 border-b border-outline-variant bg-white/80 backdrop-blur-md z-50 flex items-center justify-between px-6">
        <div className="flex items-center gap-3">
          <Link href="/" className="flex items-center gap-3 hover:opacity-80 transition-opacity">
             <span className="font-bold text-lg text-primary-sendlib tracking-tight">SendLib <span className="text-secondary font-normal">Docs</span></span>
          </Link>
        </div>
        <div className="flex items-center gap-4">
          <Link href="/dashboard" className="text-[13px] font-bold px-4 py-2 bg-white hover:bg-surface-container-low rounded-lg text-primary-sendlib transition-colors border border-outline-variant shadow-xs">
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
