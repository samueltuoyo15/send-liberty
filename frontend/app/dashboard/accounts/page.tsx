"use client";

import { Mail } from "lucide-react";
import { Button } from "@/components/ui/button";

export default function AccountsPage() {
  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Gmail Accounts</h1>
          <p className="text-muted-foreground mt-1">
            Connect and manage the Gmail accounts used for sending emails.
          </p>
        </div>
        <Button className="font-semibold shadow-md">
          <Mail className="w-4 h-4 mr-2" />
          Connect New Account
        </Button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="rounded-xl border border-border bg-card p-6 shadow-sm flex items-center gap-4">
          <div className="h-12 w-12 rounded-full bg-primary/10 text-primary flex items-center justify-center">
            <Mail className="h-6 w-6" />
          </div>
          <div className="flex-1">
            <h3 className="font-semibold text-foreground">dev@startup.com</h3>
            <p className="text-sm text-green-600 font-medium">Connected & Active</p>
          </div>
          <Button variant="outline" size="sm">Manage</Button>
        </div>
      </div>
    </div>
  );
}
