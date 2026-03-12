"use client";

import { Key } from "lucide-react";
import { Button } from "@/components/ui/button";

export default function KeysPage() {
  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">API Keys</h1>
          <p className="text-muted-foreground mt-1">
            Manage your API keys for authenticating requests.
          </p>
        </div>
        <Button className="font-semibold shadow-md">
          <Key className="w-4 h-4 mr-2" />
          Generate New Key
        </Button>
      </div>

      <div className="rounded-xl border border-border bg-card p-8 text-center text-muted-foreground shadow-sm">
        <Key className="w-12 h-12 mx-auto mb-4 opacity-50" />
        <h3 className="text-lg font-medium text-foreground mb-1">No API keys found</h3>
        <p className="max-w-sm mx-auto mb-6">You haven't generated any API keys yet. Create one to start using the SendLiberty API.</p>
        <Button variant="outline" className="font-medium shadow-sm">Generate Key</Button>
      </div>
    </div>
  );
}
