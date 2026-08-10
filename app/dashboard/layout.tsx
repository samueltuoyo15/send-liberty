"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import { usePathname, useRouter } from "next/navigation";
import { HugeiconsIcon } from '@hugeicons/react';
import { 
  BarChartIcon, 
  Key01Icon, 
  MailIcon, 
  Settings01Icon, 
  FileTypeIcon, 
  Menu01Icon,
  Cancel01Icon,
} from '@hugeicons/core-free-icons';
import { Button } from "@/components/ui/button";
import { useMe, useLogout } from "@/hooks/useAuth";
import { 
  DropdownMenu, 
  DropdownMenuTrigger, 
  DropdownMenuContent, 
  DropdownMenuItem, 
  DropdownMenuSeparator
} from "@/components/ui/dropdown-menu";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog";

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();
  const router = useRouter();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [avatarError, setAvatarError] = useState(false);
  const [logoutConfirmOpen, setLogoutConfirmOpen] = useState(false);
  const { data: user, isLoading, error } = useMe();
  const { mutate: logout } = useLogout();

  useEffect(() => {
    if (!isLoading && (error || !user)) {
      router.push("/login");
    }
  }, [isLoading, error, user, router]);

  if (isLoading) {
    return (
      <div className="min-h-screen bg-background-sendlib flex flex-col items-center justify-center">
        <div className="flex flex-col items-center gap-3">
          <div className="h-9 w-9 rounded-full border-2 border-primary-sendlib border-t-transparent animate-spin" />
          <p className="text-sm font-medium text-secondary font-sans animate-pulse">Loading dashboard...</p>
        </div>
      </div>
    );
  }

  if (!user) {
    return null;
  }

  const navigation = [
    { name: "Overview", href: "/dashboard", icon: BarChartIcon },
    { name: "Gmail Accounts", href: "/dashboard/accounts", icon: MailIcon },
    { name: "API Keys", href: "/dashboard/keys", icon: Key01Icon },
    { name: "Email Logs", href: "/dashboard/logs", icon: FileTypeIcon },
    { name: "Settings", href: "/dashboard/settings", icon: Settings01Icon },
  ];

  const closeMobileMenu = () => setIsMobileMenuOpen(false);

  return (
    <div className="min-h-screen bg-background-sendlib text-on-background font-body-md flex flex-col selection:bg-primary-sendlib selection:text-white">
      {/* Top Navigation Header */}
      <header className="sticky top-0 z-50 w-full border-b border-outline-variant bg-surface-container-lowest shadow-xs">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between gap-4">
          
          {/* Left: Brand Logo & Mobile Toggle */}
          <div className="flex items-center gap-3">
            <Button variant="ghost" size="icon" className="lg:hidden text-on-surface-variant cursor-pointer" onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}>
              <HugeiconsIcon icon={isMobileMenuOpen ? Cancel01Icon : Menu01Icon} size={20} color='currentColor' strokeWidth={1.5} />
            </Button>
            <Link href="/" className="flex items-center gap-2 transition-opacity">
              <img 
                src="/logo.png" 
                alt="Sendlib Logo" 
                className="h-7 md:h-8 w-auto object-contain"
              />
            </Link>
          </div>

          {/* Middle: Horizontal Nav Links (Desktop) */}
          <nav className="hidden lg:flex items-center gap-1">
            {navigation.map((item) => {
              const isActive = pathname === item.href;
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  className={`flex items-center gap-2 rounded-lg px-3 py-2 text-sm font-label-sm transition-all cursor-pointer ${
                    isActive 
                      ? "bg-primary-sendlib text-white font-semibold shadow-xs" 
                      : "text-secondary hover:bg-surface-container-low hover:text-on-background"
                  }`}
                >
                  <HugeiconsIcon icon={item.icon} size={16} color='currentColor' strokeWidth={1.5} />
                  {item.name}
                </Link>
              );
            })}
          </nav>

          {/* Right: User Profile Menu */}
          <div className="flex items-center gap-3">
            {!user ? (
              <div className="h-8 w-8 rounded-full bg-outline-variant/40 animate-pulse" />
            ) : (
              <DropdownMenu>
                <DropdownMenuTrigger className="flex h-8 w-8 items-center justify-center rounded-full hover:opacity-90 transition-opacity cursor-pointer outline-none">
                  {user.avatar && !avatarError ? (
                    <Image 
                      src={user.avatar} 
                      alt="Avatar" 
                      width={32}
                      height={32}
                      className="h-8 w-8 rounded-full object-cover border border-outline-variant"
                      onError={() => setAvatarError(true)}
                    />
                  ) : (
                    <Image 
                      src={`https://api.dicebear.com/7.x/initials/svg?seed=${encodeURIComponent(user.displayName || user.email || "U")}`} 
                      alt="Avatar" 
                      width={32}
                      height={32}
                      className="h-8 w-8 rounded-full object-cover border border-outline-variant" 
                    />
                  )}
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="w-56 mt-1 border border-outline-variant bg-surface-container-lowest text-on-background p-1.5 rounded-xl shadow-md">
                  <div className="px-2.5 py-2 text-xs font-semibold text-secondary truncate">
                    Logged in as: {user.email}
                  </div>
                  <DropdownMenuSeparator className="-mx-1.5 my-1.5 h-px bg-outline-variant/30" />
                  <DropdownMenuItem className="rounded-lg hover:bg-surface-container-low px-2 py-1.5 cursor-pointer outline-none flex items-center" onClick={() => router.push("/dashboard/settings")}>
                    <HugeiconsIcon icon={Settings01Icon} size={14} color='currentColor' strokeWidth={1.5} className="mr-2 text-secondary" />
                    Settings
                  </DropdownMenuItem>
                  <DropdownMenuSeparator className="-mx-1.5 my-1.5 h-px bg-outline-variant/30" />
                  <DropdownMenuItem variant="destructive" className="rounded-lg hover:bg-destructive/10 px-2 py-1.5 cursor-pointer outline-none text-destructive font-medium" onClick={() => setLogoutConfirmOpen(true)}>
                    Sign Out
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            )}
          </div>
        </div>

        {/* Mobile Dropdown Navigation */}
        {isMobileMenuOpen && (
          <div className="lg:hidden border-t border-outline-variant bg-surface-container-lowest px-4 py-3 space-y-1">
            {navigation.map((item) => {
              const isActive = pathname === item.href;
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  onClick={closeMobileMenu}
                  className={`flex items-center gap-3 rounded-lg px-3.5 py-2.5 text-sm font-label-sm transition-all cursor-pointer ${
                    isActive 
                      ? "bg-primary-sendlib text-white font-semibold" 
                      : "text-secondary hover:bg-surface-container-low hover:text-on-background"
                  }`}
                >
                  <HugeiconsIcon icon={item.icon} size={18} color='currentColor' strokeWidth={1.5} />
                  {item.name}
                </Link>
              );
            })}
          </div>
        )}
      </header>

      {/* Main Content Area */}
      <main className="flex-1 max-w-7xl mx-auto w-full px-4 sm:px-6 lg:px-8 py-8">
        {children}
      </main>

      {/* Sign Out Confirmation Dialog */}
      <Dialog open={logoutConfirmOpen} onOpenChange={setLogoutConfirmOpen}>
        <DialogContent>
          <DialogHeader className="mb-2">
            <DialogTitle className="text-xl font-headline-md font-bold text-destructive">Sign Out</DialogTitle>
            <DialogDescription className="text-secondary text-sm leading-relaxed mt-1">
              Are you sure you want to sign out of your Sendlib account? You will need to log in again to access your dashboard.
            </DialogDescription>
          </DialogHeader>
          <div className="flex flex-row gap-3 mt-4 pt-4 border-t border-outline-variant/60">
            <Button 
              variant="outline" 
              className="flex-1 rounded-lg font-label-sm border border-outline-variant hover:bg-surface-container-low" 
              onClick={() => setLogoutConfirmOpen(false)}
            >
              Cancel
            </Button>
            <Button 
              className="flex-1 rounded-lg font-label-sm bg-destructive hover:bg-destructive/90 text-white" 
              onClick={() => {
                setLogoutConfirmOpen(false);
                logout();
              }}
            >
              Sign Out
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}
