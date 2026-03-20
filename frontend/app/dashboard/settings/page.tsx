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
      </div>
    </div>
  );
}
