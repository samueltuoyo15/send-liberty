"use client";

import { Save, User, Laptop } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useMe, useUpdateProfile, useSwitchMode } from "@/hooks/useAuth";
import { useState, useEffect } from "react";
import { Skeleton } from "@/components/ui/skeleton";

export default function SettingsPage() {
  const { data: user, isLoading } = useMe();
  const { mutate: updateProfile, isPending: isUpdating } = useUpdateProfile();
  const { mutate: switchMode, isPending: isSwitching } = useSwitchMode();
  const [displayName, setDisplayName] = useState("");
  const [theme, setTheme] = useState("system");

  useEffect(() => {
    if (user) {
      setDisplayName(user.display_name || "");
    }
  }, [user]);

  const handleSave = () => {
    updateProfile({ display_name: displayName });
  };

  return (
    <div className="space-y-6 max-w-2xl">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Settings</h1>
        <p className="text-muted-foreground mt-1">
          Manage your account settings and preferences.
        </p>
      </div>

      <div className="space-y-6">
        <div className="rounded-xl border border-border bg-card shadow-sm p-6">
          <div className="flex items-center gap-2 mb-4">
            <User className="w-5 h-5 text-primary" />
            <h3 className="font-semibold text-lg">Profile</h3>
          </div>
          {isLoading ? (
            <div className="space-y-4">
              <Skeleton className="h-10 w-full" />
              <Skeleton className="h-10 w-full" />
              <Skeleton className="h-10 w-24" />
            </div>
          ) : (
            <div className="space-y-4">
              <div>
                <label className="text-sm font-medium mb-1.5 block">
                  Display Name
                </label>
                <input
                  type="text"
                  value={displayName}
                  onChange={(e) => setDisplayName(e.target.value)}
                  className="w-full rounded-md border border-border bg-background px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-ring"
                />
              </div>
              <div>
                <label className="text-sm font-medium mb-1.5 block">
                  Email Address
                </label>
                <input
                  type="email"
                  value={user?.email || ""}
                  className="w-full rounded-md border border-border bg-muted/50 px-3 py-2 text-sm text-muted-foreground outline-none"
                  disabled
                />
              </div>
              <div>
                <label className="text-sm font-medium mb-1.5 block">
                  GitHub Username
                </label>
                <input
                  type="text"
                  value={user?.github_username || ""}
                  className="w-full rounded-md border border-border bg-muted/50 px-3 py-2 text-sm text-muted-foreground outline-none"
                  disabled
                />
              </div>
              <Button className="mt-2" onClick={handleSave} disabled={isUpdating}>
                <Save className="w-4 h-4 mr-2" /> Save Changes
              </Button>
            </div>
          )}
        </div>

        <div className="rounded-xl border border-border bg-card shadow-sm p-6">
          <div className="flex items-center gap-2 mb-4">
            <Laptop className="w-5 h-5 text-primary" />
            <h3 className="font-semibold text-lg">Application Settings</h3>
          </div>
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <h4 className="font-medium text-sm">API Mode</h4>
                <p className="text-xs text-muted-foreground mt-1">
                  Switch between test and live mode for your API.
                </p>
              </div>
              {isLoading ? (
                <Skeleton className="h-10 w-32" />
              ) : (
                <select 
                  className="rounded-md border border-border bg-background px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-ring"
                  value={user?.mode || "test_mode"}
                  onChange={(e) => switchMode(e.target.value as "test_mode" | "live_mode")}
                  disabled={isSwitching}
                >
                  <option value="test_mode">Test Mode</option>
                  <option value="live_mode">Live Mode</option>
                </select>
              )}
            </div>
            <div className="flex items-center justify-between">
              <div>
                <h4 className="font-medium text-sm">Theme Preferences</h4>
                <p className="text-xs text-muted-foreground mt-1">
                  Choose how SendLiberty looks to you.
                </p>
              </div>
              <select 
                className="rounded-md border border-border bg-background px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-ring"
                value={theme}
                onChange={(e) => setTheme(e.target.value)}
              >
                <option value="system">System Default</option>
                <option value="light">Light Mode</option>
                <option value="dark">Dark Mode</option>
              </select>
            </div>
          </div>
        </div>

        <div className="rounded-lg border border-blue-200 bg-blue-50 dark:bg-blue-950/20 dark:border-blue-900/50 p-4">
          <div className="flex gap-3">
            <div className="text-blue-600 dark:text-blue-500 shrink-0">
              <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
              </svg>
            </div>
            <div className="flex-1">
              <h3 className="font-semibold text-blue-900 dark:text-blue-200 text-sm mb-1">Scale with Custom Domain SMTP</h3>
              <p className="text-sm text-blue-800 dark:text-blue-300 leading-relaxed mb-2">
                Gmail has daily sending limits (500-2,000 emails). For unlimited sending, configure SMTP with your custom domain. 
                Your system automatically falls back to SMTP when Gmail is unavailable.
              </p>
              <p className="text-xs text-blue-700 dark:text-blue-400 font-medium">
                💡 Pro tip: Use Gmail for quick setup, then add SMTP for production scale.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
