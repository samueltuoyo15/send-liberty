"use client";

import { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { 
  BarChart3, 
  Key, 
  Mail, 
  Settings, 
  FileText, 
  CreditCard,
  Menu,
  X
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { useMe } from "@/hooks/useAuth";

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const { data: user, isLoading } = useMe();

  const navigation = [
    { name: "Overview", href: "/dashboard", icon: BarChart3 },
    { name: "Scheduled Emails", href: "/dashboard/scheduled", icon: FileText },
    { name: "Batch Sending", href: "/dashboard/batch", icon: Mail },
    { name: "API Keys", href: "/dashboard/keys", icon: Key },
    { name: "Gmail Accounts", href: "/dashboard/accounts", icon: Mail },
    { name: "Email Logs", href: "/dashboard/logs", icon: FileText },
    { name: "Billing", href: "/dashboard/billing", icon: CreditCard },
    { name: "Settings", href: "/dashboard/settings", icon: Settings },
  ];

  const closeMobileMenu = () => setIsMobileMenuOpen(false);

  return (
    <div className="flex min-h-screen bg-background text-foreground font-sans selection:bg-foreground selection:text-background">
      {/* Mobile Sidebar Overlay */}
      {isMobileMenuOpen && (
        <div 
          className="fixed inset-0 z-40 bg-background/80 backdrop-blur-sm md:hidden"
          onClick={closeMobileMenu}
        />
      )}

      {/* Sidebar - Desktop & Mobile */}
      <aside className={`fixed inset-y-0 left-0 z-50 w-64 transform flex-col border-r border-border bg-background transition-transform duration-200 ease-in-out md:static md:translate-x-0 md:flex ${isMobileMenuOpen ? "translate-x-0 flex" : "-translate-x-full hidden md:flex"}`}>
        <div className="flex h-16 items-center justify-between px-6 mb-2">
          <div className="flex items-center gap-3">
            <div className="flex h-8 w-8 items-center justify-center rounded bg-primary text-primary-foreground shadow-sm">
              <Mail className="h-4 w-4" />
            </div>
            <span className="text-xl font-bold tracking-tight text-primary">SendLiberty</span>
          </div>
          <Button variant="ghost" size="icon" className="md:hidden" onClick={closeMobileMenu}>
            <X className="h-5 w-5" />
          </Button>
        </div>
        
        <nav className="flex-1 px-4 py-4 space-y-1">
          {navigation.map((item) => {
            const isActive = pathname === item.href;
            return (
              <Link
                key={item.href}
                href={item.href}
                onClick={closeMobileMenu}
                className={`flex items-center gap-3 rounded px-3 py-2.5 text-sm transition-colors ${
                  isActive 
                    ? "bg-foreground text-background font-medium" 
                    : "text-muted-foreground hover:bg-muted hover:text-foreground"
                }`}
              >
                <item.icon className="h-4 w-4" />
                {item.name}
              </Link>
            );
          })}
        </nav>
        
        <div className="p-4 mt-auto">
          <div className="flex items-center gap-3 rounded-xl border border-border bg-card p-3 shadow-sm hover:shadow transition-all cursor-pointer">
            {isLoading ? (
              <div className="flex items-center gap-3 w-full">
                <Skeleton className="h-9 w-9 rounded-full" />
                <div className="flex flex-col gap-2 w-full">
                  <Skeleton className="h-4 w-16" />
                  <Skeleton className="h-3 w-24" />
                </div>
              </div>
            ) : user ? (
              <>
                {user.avatar ? (
                  <img src={user.avatar} alt="Avatar" className="h-9 w-9 rounded-full object-cover" />
                ) : (
                  <div className="flex h-9 w-9 items-center justify-center rounded-full bg-primary/10 text-primary font-bold">
                    {user.display_name?.charAt(0) || "U"}
                  </div>
                )}
                <div className="flex flex-col">
                  <span className="text-sm font-bold leading-none">{user.display_name}</span>
                  <span className="text-xs text-muted-foreground mt-1">{user.credits} Credits Left</span>
                </div>
              </>
            ) : null}
          </div>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex w-full flex-col flex-1">
        {/* Header - Mobile & Desktop */}
        <header className="flex h-16 items-center justify-between border-b border-border bg-card px-4 md:px-8 sticky top-0 z-10 w-full overflow-hidden">
          <div className="flex items-center gap-3 md:hidden">
            <Button variant="ghost" size="icon" onClick={() => setIsMobileMenuOpen(true)}>
              <Menu className="h-5 w-5" />
            </Button>
            <div className="flex h-8 w-8 items-center justify-center rounded bg-primary text-primary-foreground shadow-sm">
              <Mail className="h-4 w-4" />
            </div>
          </div>
          
          <div className="hidden md:flex flex-1 max-w-sm items-center rounded border border-border bg-background px-3 h-10 transition-colors focus-within:border-foreground relative">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-4 w-4 text-muted-foreground absolute left-3"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
            </svg>
            <input 
              className="flex-1 bg-transparent border-none outline-none text-sm px-8 placeholder:text-muted-foreground h-full w-full font-mono" 
              placeholder="Search logs or keys..." 
            />
            <div className="absolute right-2 hidden lg:flex items-center justify-center px-1.5 h-5 rounded bg-muted text-[10px] font-mono text-muted-foreground">
              ⌘K
            </div>
          </div>

          <div className="flex items-center gap-4">
            <Button variant="outline" className="hidden sm:flex rounded font-medium border-border h-10 px-4">
              <Key className="w-4 h-4 mr-2" />
              New API Key
            </Button>
          </div>
        </header>

        {/* Page Content */}
        <div className="flex-1 overflow-auto bg-background p-4 md:p-8">
          {children}
        </div>
      </main>
    </div>
  );
}
