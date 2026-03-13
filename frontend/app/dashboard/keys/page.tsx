"use client";

import { Key, Copy, CheckCircle2, XCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { useApiKeys } from "@/hooks/useApiKeys";

export default function KeysPage() {
  const { data: apiKeys, isLoading } = useApiKeys();
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

      {isLoading ? (
        <div className="space-y-4">
          <Skeleton className="h-24 w-full rounded-xl" />
          <Skeleton className="h-24 w-full rounded-xl" />
        </div>
      ) : !apiKeys || apiKeys.length === 0 ? (
        <div className="rounded-xl border border-border bg-card p-8 text-center text-muted-foreground shadow-sm">
          <Key className="w-12 h-12 mx-auto mb-4 opacity-50" />
          <h3 className="text-lg font-medium text-foreground mb-1">No API keys found</h3>
          <p className="max-w-sm mx-auto mb-6">You haven't generated any API keys yet. Create one to start using the SendLiberty API.</p>
          <Button variant="outline" className="font-medium shadow-sm">Generate Key</Button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {apiKeys.map((key) => (
            <div key={key.id} className="rounded-xl border border-border bg-card p-6 shadow-sm flex flex-col gap-4 relative group">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Key className="w-5 h-5 text-muted-foreground" />
                  <span className="font-semibold text-foreground">{key.name || "Default Key"}</span>
                </div>
                {key.status === "active" ? (
                  <span className="flex items-center gap-1.5 px-2 py-0.5 rounded-full text-xs font-medium border border-emerald-200 bg-emerald-50 text-emerald-700 dark:bg-emerald-500/10 dark:text-emerald-400 dark:border-emerald-500/20">
                    <CheckCircle2 className="w-3 h-3" /> Active
                  </span>
                ) : (
                  <span className="flex items-center gap-1.5 px-2 py-0.5 rounded-full text-xs font-medium border border-destructive/20 bg-destructive/10 text-destructive">
                    <XCircle className="w-3 h-3" /> Revoked
                  </span>
                )}
              </div>
              <div>
                <div className="text-xs text-muted-foreground mb-1 uppercase tracking-wider font-semibold">Key Hint</div>
                <div className="font-mono bg-muted p-2 rounded text-sm flex items-center justify-between border border-border">
                  <span>••••••••{key.key_hint}</span>
                  <Button variant="ghost" size="icon" className="h-6 w-6 opacity-0 group-hover:opacity-100 transition-opacity">
                    <Copy className="h-3 w-3" />
                  </Button>
                </div>
              </div>
              <div className="text-xs text-muted-foreground mt-auto pt-2 border-t border-border">
                Created {new Date(key.created_at).toLocaleDateString()}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
