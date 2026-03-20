"use client";

import { Key, Copy, CheckCircle2, XCircle, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { useApiKeys, useGenerateApiKey, useDeleteApiKey, useRevokeApiKey } from "@/hooks/useApiKeys";
import { useState } from "react";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";

export default function KeysPage() {
  const { data: apiKeys, isLoading } = useApiKeys();
  const { mutate: generateKey, isPending: isGenerating } = useGenerateApiKey();
  const { mutate: deleteKey, isPending: isDeleting } = useDeleteApiKey();
  const { mutate: revokeKey, isPending: isRevoking } = useRevokeApiKey();
  const [newKeyDialog, setNewKeyDialog] = useState<{ key: string; hint: string } | null>(null);
  const [generateDialog, setGenerateDialog] = useState(false);
  const [keyLabel, setKeyLabel] = useState("");

  const handleGenerate = () => {
    generateKey(keyLabel || undefined, {
      onSuccess: (data) => {
        setNewKeyDialog({ key: data.key, hint: data.key_hint });
        setGenerateDialog(false);
        setKeyLabel("");
      }
    });
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">API Keys</h1>
          <p className="text-muted-foreground mt-1">
            Manage your API keys for authenticating requests.
          </p>
        </div>
        <Button 
          className="font-semibold shadow-md" 
          onClick={() => setGenerateDialog(true)}
          disabled={isGenerating}
        >
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
          <Button 
            variant="outline" 
            className="font-medium shadow-sm" 
            onClick={() => setGenerateDialog(true)}
          >
            Generate Key
          </Button>
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
                  <Button 
                    variant="ghost" 
                    size="icon" 
                    className="h-6 w-6 opacity-0 group-hover:opacity-100 transition-opacity"
                    onClick={() => {
                      navigator.clipboard.writeText(`••••••••${key.key_hint}`);
                    }}
                  >
                    <Copy className="h-3 w-3" />
                  </Button>
                </div>
              </div>
              <div className="text-xs text-muted-foreground mt-auto pt-2 border-t border-border flex items-center justify-between">
                <span>Created {new Date(key.created_at).toLocaleDateString()}</span>
                {key.status === "active" && (
                  <Button
                    variant="ghost"
                    size="sm"
                    className="h-6 px-2 text-destructive hover:bg-destructive/10"
                    onClick={() => {
                      if (confirm("Delete this API key? This action cannot be undone.")) {
                        deleteKey(key.id);
                      }
                    }}
                    disabled={isDeleting}
                  >
                    <Trash2 className="w-3 h-3" />
                  </Button>
                )}
              </div>
            </div>
          ))}
        </div>
      )}

      <Dialog open={generateDialog} onOpenChange={setGenerateDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Generate New API Key</DialogTitle>
            <DialogDescription>
              Give your API key a name to help you identify it later.
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4">
            <div>
              <label className="text-sm font-medium mb-2 block">Key Label (Optional)</label>
              <Input
                placeholder="Production API Key"
                value={keyLabel}
                onChange={(e) => setKeyLabel(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && handleGenerate()}
              />
            </div>
            <div className="flex gap-2">
              <Button variant="outline" className="flex-1" onClick={() => setGenerateDialog(false)}>
                Cancel
              </Button>
              <Button className="flex-1" onClick={handleGenerate} disabled={isGenerating}>
                Generate
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>

      <Dialog open={!!newKeyDialog} onOpenChange={() => setNewKeyDialog(null)}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>API Key Generated</DialogTitle>
            <DialogDescription>
              Save this key now. You won't be able to see it again.
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4">
            <div>
              <label className="text-sm font-medium mb-2 block">Your API Key</label>
              <div className="font-mono bg-muted p-3 rounded text-sm break-all border border-border">
                {newKeyDialog?.key}
              </div>
            </div>
            <Button 
              className="w-full" 
              onClick={() => {
                navigator.clipboard.writeText(newKeyDialog?.key || "");
                setNewKeyDialog(null);
              }}
            >
              Copy & Close
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}
