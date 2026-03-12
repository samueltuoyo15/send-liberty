"use client";

import { Save, User, Laptop } from "lucide-react";
import { Button } from "@/components/ui/button";

export default function SettingsPage() {
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
          <div className="space-y-4">
            <div>
              <label className="text-sm font-medium mb-1.5 block">Display Name</label>
              <input 
                type="text" 
                defaultValue="Developer" 
                className="w-full rounded-md border border-border bg-background px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-ring"
              />
            </div>
            <div>
              <label className="text-sm font-medium mb-1.5 block">Email Address</label>
              <input 
                type="email" 
                defaultValue="dev@sendliberty.com" 
                className="w-full rounded-md border border-border bg-muted/50 px-3 py-2 text-sm text-muted-foreground outline-none"
                disabled
              />
            </div>
            <Button className="mt-2"><Save className="w-4 h-4 mr-2" /> Save Changes</Button>
          </div>
        </div>

        <div className="rounded-xl border border-border bg-card shadow-sm p-6">
          <div className="flex items-center gap-2 mb-4">
            <Laptop className="w-5 h-5 text-primary" />
            <h3 className="font-semibold text-lg">Application Settings</h3>
          </div>
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <h4 className="font-medium text-sm">Theme Preferences</h4>
                <p className="text-xs text-muted-foreground mt-1">Choose how SendLiberty looks to you.</p>
              </div>
              <select className="rounded-md border border-border bg-background px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-ring">
                <option>System Default</option>
                <option>Light Mode</option>
                <option>Dark Mode</option>
              </select>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
