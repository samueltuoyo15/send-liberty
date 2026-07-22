"use client";

import { HugeiconsIcon } from '@hugeicons/react';
import { Key01Icon, Copy01Icon, CheckmarkCircle01Icon, CancelCircleIcon, Delete01Icon } from '@hugeicons/core-free-icons';
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { useApiKeys, useGenerateApiKey, useDeleteApiKey, useRevokeApiKey } from "@/hooks/useApiKeys";
import { useState, useEffect, Suspense } from "react";
import { Sheet, SheetContent, SheetDescription, SheetHeader, SheetTitle, SheetFooter } from "@/components/ui/sheet";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { useSearchParams } from "next/navigation";
import confetti from "canvas-confetti";
import { toast } from "sonner";

function KeysContent() {
  const searchParams = useSearchParams();
  const { data: apiKeys, isLoading } = useApiKeys();
  const { mutate: generateKey, isPending: isGenerating } = useGenerateApiKey();
  const { mutate: deleteKey, isPending: isDeleting } = useDeleteApiKey();
  const [newKeyDialog, setNewKeyDialog] = useState<{ key: string; hint: string } | null>(null);
  const [generateDialog, setGenerateDialog] = useState(false);
  const [keyLabel, setKeyLabel] = useState("");
  const [allowedOriginsText, setAllowedOriginsText] = useState("");
  const [deleteKeyId, setDeleteKeyId] = useState<string | null>(null);

  const copyToClipboard = (text: string) => {
    if (navigator.clipboard && window.isSecureContext) {
      navigator.clipboard.writeText(text);
    } else {
      const textArea = document.createElement("textarea");
      textArea.value = text;
      textArea.style.position = "fixed";
      textArea.style.left = "-999999px";
      document.body.appendChild(textArea);
      textArea.focus();
      textArea.select();
      document.execCommand("copy");
      textArea.remove();
    }
    toast.success("API key copied to clipboard!");
  };

  useEffect(() => {
    if (searchParams.get("generate") === "true") {
      setGenerateDialog(true);
    }
  }, [searchParams]);

  const handleGenerate = () => {
    const allowedOrigins = allowedOriginsText
      .split(/[\n,]/)
      .map(o => o.trim())
      .filter(o => o.length > 0);

    generateKey({
      name: keyLabel || undefined,
      allowedOrigins: allowedOrigins.length > 0 ? allowedOrigins : undefined
    }, {
      onSuccess: (data) => {
        setNewKeyDialog({ key: data.key, hint: data.prefix });
        setGenerateDialog(false);
        setKeyLabel("");
        setAllowedOriginsText("");
      }
    });
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-3xl font-headline-md font-bold tracking-tight text-primary-sendlib">API Keys</h1>
          <p className="text-secondary font-body-md mt-1">
            Manage your API keys for authenticating requests.
          </p>
          {!isLoading && apiKeys && (
            <p className="text-xs mt-1.5 font-medium">
              <span className={apiKeys.filter(k => !k.revoked).length >= 10 ? "text-destructive font-bold" : "text-secondary"}>
                {apiKeys.filter(k => !k.revoked).length} / 10 active keys used
              </span>
            </p>
          )}
        </div>
        <Button 
          size="lg"
          className="rounded-lg font-label-sm bg-primary-sendlib hover:bg-primary-sendlib/90 text-white shadow-sm transition-all active:scale-95" 
          onClick={() => setGenerateDialog(true)}
          disabled={isGenerating}
        >
          <HugeiconsIcon icon={Key01Icon} size={16} color='currentColor' strokeWidth={1.5} />
          <span className="ml-2">Generate New Key</span>
        </Button>
      </div>

      {isLoading ? (
        <div className="space-y-4">
          <Skeleton className="h-24 w-full rounded-xl" />
          <Skeleton className="h-24 w-full rounded-xl" />
        </div>
      ) : (
        <div className="rounded-xl border border-[#d3c5ff]/50 bg-[#f0ebff]/15 overflow-hidden hover:bg-[#f0ebff]/25 transition-colors">
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="border-b border-[#d3c5ff]/50 bg-[#d3c5ff]/25">
                  <th className="px-6 py-3.5 text-xs font-bold uppercase tracking-wider text-[#4a358c]">Key Label</th>
                  <th className="px-6 py-3.5 text-xs font-bold uppercase tracking-wider text-[#4a358c]">Key Prefix</th>
                  <th className="px-6 py-3.5 text-xs font-bold uppercase tracking-wider text-[#4a358c]">Allowed Origins</th>
                  <th className="px-6 py-3.5 text-xs font-bold uppercase tracking-wider text-[#4a358c]">Status</th>
                  <th className="px-6 py-3.5 text-xs font-bold uppercase tracking-wider text-[#4a358c]">Created</th>
                  <th className="px-6 py-3.5 text-right text-xs font-bold uppercase tracking-wider text-[#4a358c] pr-6"></th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#d3c5ff]/35">
                {!apiKeys || apiKeys.length === 0 ? (
                  <tr className="hover:bg-transparent">
                    <td colSpan={6} className="text-center py-10">
                      <div className="flex flex-col items-center justify-center max-w-[380px] mx-auto space-y-2.5">
                        <HugeiconsIcon icon={Key01Icon} size={40} color='currentColor' strokeWidth={1.5} className="text-[#4a358c] opacity-40 mb-0.5" />
                        <h4 className="text-base font-headline-md font-bold text-[#2c1075]">No API keys found</h4>
                        <p className="text-xs text-[#4a358c]/80 leading-relaxed">
                          You haven't generated any API keys yet. Create one to start using the SendLib API.
                        </p>
                        <div className="pt-1">
                          <Button 
                            size="sm"
                            className="rounded-lg font-label-sm bg-[#5a36cf] hover:bg-[#5a36cf]/90 text-white shadow-sm px-3.5 h-8 cursor-pointer" 
                            onClick={() => setGenerateDialog(true)}
                          >
                            Generate Key
                          </Button>
                        </div>
                      </div>
                    </td>
                  </tr>
                ) : (
                  apiKeys.map((key) => (
                    <tr key={key.id} className="hover:bg-[#d3c5ff]/15 transition-colors">
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex items-center gap-2">
                          <HugeiconsIcon icon={Key01Icon} size={16} color='currentColor' strokeWidth={1.5} className="text-[#5a36cf]" />
                          <span className="font-bold text-[#2c1075]">{key.name || "Default Key"}</span>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <code className="px-2 py-1 rounded bg-[#d3c5ff]/30 text-xs text-[#2c1075] font-mono">
                          ••••••••{key.keyPrefix}
                        </code>
                      </td>
                      <td className="px-6 py-4">
                        {key.allowedOrigins && key.allowedOrigins.length > 0 ? (
                          <div className="flex flex-wrap gap-1.5 max-w-[280px]">
                            {key.allowedOrigins.map((origin) => (
                              <code key={origin} className="px-2 py-0.5 rounded bg-surface-container-low font-mono text-[10px] text-secondary border border-outline-variant/40">
                                {origin}
                              </code>
                            ))}
                          </div>
                        ) : (
                          <span className="text-xs text-secondary italic">Any origin allowed</span>
                        )}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        {!key.revoked ? (
                          <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-label-xs border border-emerald-200 bg-emerald-50 text-emerald-700">
                            <HugeiconsIcon icon={CheckmarkCircle01Icon} size={12} color='currentColor' strokeWidth={1.5} /> Active
                          </span>
                        ) : (
                          <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-label-xs border border-destructive/20 bg-destructive/10 text-destructive">
                            <HugeiconsIcon icon={CancelCircleIcon} size={12} color='currentColor' strokeWidth={1.5} /> Revoked
                          </span>
                        )}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-xs text-secondary">
                        {new Date(key.createdAt).toLocaleDateString()}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-right pr-6">
                        {!key.revoked && (
                          <Button
                            variant="ghost"
                            size="icon-xs"
                            className="h-7 w-7 text-destructive hover:bg-destructive/10 rounded-md cursor-pointer"
                            onClick={() => setDeleteKeyId(key.id)}
                            disabled={isDeleting}
                          >
                            <HugeiconsIcon icon={Delete01Icon} size={14} color='currentColor' strokeWidth={1.5} />
                          </Button>
                        )}
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Generate API Key Slide-over Drawer */}
      <Sheet open={generateDialog} onOpenChange={setGenerateDialog}>
        <SheetContent side="right">
          <SheetHeader className="p-0 mb-6">
            <SheetTitle className="text-xl font-headline-md font-bold text-primary-sendlib">Generate New API Key</SheetTitle>
            <SheetDescription className="text-secondary text-sm">
              Give your API key a label to help identify where it is used (e.g. Production Backend, Staging Server).
            </SheetDescription>
          </SheetHeader>
          <div className="space-y-5">
            <div>
              <label className="text-sm font-label-sm font-semibold text-on-background mb-2 block">
                Key Label (Optional)
              </label>
              <Input
                placeholder="e.g. Production Backend"
                value={keyLabel}
                onChange={(e) => setKeyLabel(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && handleGenerate()}
                className="h-10 rounded-lg border border-outline-variant bg-surface-container-low px-3 text-sm focus-visible:border-primary-sendlib"
              />
              <div className="flex justify-between mt-1.5 text-xs">
                <span className={keyLabel.length > 25 ? "text-destructive font-bold" : "text-secondary font-medium"}>
                  {keyLabel.length}/25 characters
                </span>
                {keyLabel.length > 25 && (
                  <span className="text-destructive font-bold">Exceeds limit</span>
                )}
              </div>
            </div>
            <div>
              <label className="text-sm font-label-sm font-semibold text-on-background mb-2 block">
                Allowed Origins / Domains (Optional)
              </label>
              <textarea
                placeholder="e.g.&#10;localhost:3000&#10;myapp.com&#10;sub.myapp.com"
                value={allowedOriginsText}
                onChange={(e) => setAllowedOriginsText(e.target.value)}
                className="w-full rounded-lg border border-outline-variant bg-surface-container-low p-3 text-sm focus-visible:border-primary-sendlib outline-none min-h-[100px] font-mono placeholder:font-sans leading-relaxed"
              />
              <div className="flex justify-between mt-1.5 text-xs">
                <span className={allowedOriginsText.length > 200 ? "text-destructive font-bold" : "text-secondary font-medium"}>
                  {allowedOriginsText.length}/200 characters
                </span>
                {allowedOriginsText.length > 200 && (
                  <span className="text-destructive font-bold">Exceeds limit</span>
                )}
              </div>
              <p className="text-xs text-secondary mt-2 leading-relaxed">
                Restrict API requests to specific domains. If your key gets leaked, requests will still be blocked unless they originate from one of these domains. Note: Since origin headers can be spoofed by server-to-server requests, you must still keep your keys secure!
              </p>
            </div>
          </div>
          <SheetFooter className="p-0 mt-6 pt-4 border-t border-outline-variant flex-row gap-3">
            <Button variant="outline" className="flex-1 rounded-lg font-label-sm border border-outline-variant" onClick={() => setGenerateDialog(false)}>
              Cancel
            </Button>
            <Button 
              className="flex-1 rounded-lg font-label-sm bg-primary-sendlib hover:bg-primary-sendlib/90 text-white" 
              onClick={handleGenerate} 
              disabled={isGenerating || keyLabel.length > 25 || allowedOriginsText.length > 200}
            >
              {isGenerating ? "Generating..." : "Generate Key"}
            </Button>
          </SheetFooter>
        </SheetContent>
      </Sheet>

      {/* Generated Key Display Slide-over Drawer */}
      <Sheet open={!!newKeyDialog} onOpenChange={() => setNewKeyDialog(null)}>
        <SheetContent side="right">
          <SheetHeader className="p-0 mb-6">
            <SheetTitle className="text-xl font-headline-md font-bold text-primary-sendlib">API Key Generated</SheetTitle>
            <SheetDescription className="text-secondary text-sm">
              Copy this API key now. For security reasons, it will not be shown again.
            </SheetDescription>
          </SheetHeader>
          <div className="space-y-5">
            <div>
              <label className="text-sm font-label-sm font-semibold text-on-background mb-2 flex justify-between items-center">
                <span>Your Secret API Key</span>
                <span className="text-xs text-emerald-600 font-medium">Keep this key secret</span>
              </label>
              <div className="relative font-mono bg-surface-container-low p-3.5 pr-12 rounded-lg text-sm break-all border border-outline-variant text-primary-sendlib selection:bg-primary-sendlib selection:text-white">
                {newKeyDialog?.key}
                <button
                  type="button"
                  title="Copy API Key"
                  className="absolute right-2.5 top-2.5 p-1.5 rounded-md hover:bg-outline-variant/30 text-primary-sendlib transition-colors cursor-pointer"
                  onClick={() => {
                    if (newKeyDialog?.key) {
                      copyToClipboard(newKeyDialog.key);
                    }
                  }}
                >
                  <HugeiconsIcon icon={Copy01Icon} size={16} color='currentColor' strokeWidth={1.5} />
                </button>
              </div>
            </div>
          </div>
          <SheetFooter className="p-0 mt-6 pt-4 border-t border-outline-variant">
            <Button 
              className="w-full rounded-lg font-label-sm bg-primary-sendlib hover:bg-primary-sendlib/90 text-white py-2.5 cursor-pointer" 
              onClick={() => {
                if (newKeyDialog?.key) {
                  copyToClipboard(newKeyDialog.key);
                }
                confetti({
                  particleCount: 300,
                  spread: 120,
                  origin: { y: 0.6 }
                });
                setNewKeyDialog(null);
              }}
            >
              <HugeiconsIcon icon={Copy01Icon} size={16} color='currentColor' strokeWidth={1.5} className="mr-2" />
              Copy API Key & Close
            </Button>
          </SheetFooter>
        </SheetContent>
      </Sheet>

      {/* Delete API Key Confirmation Dialog */}
      <Dialog open={!!deleteKeyId} onOpenChange={(open) => !open && setDeleteKeyId(null)}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader className="mb-2">
            <DialogTitle className="text-xl font-headline-md font-bold text-destructive">Delete API Key</DialogTitle>
            <DialogDescription className="text-secondary text-sm leading-relaxed mt-1">
              Are you sure you want to delete this API key? This action is permanent and cannot be undone. Any applications using this key will immediately fail to authenticate.
            </DialogDescription>
          </DialogHeader>
          <div className="flex flex-row gap-3 mt-4 pt-4 border-t border-outline-variant/60">
            <Button 
              variant="outline" 
              className="flex-1 rounded-lg font-label-sm border border-outline-variant hover:bg-surface-container-low" 
              onClick={() => setDeleteKeyId(null)}
            >
              Cancel
            </Button>
            <Button 
              className="flex-1 rounded-lg font-label-sm bg-destructive hover:bg-destructive/90 text-white" 
              onClick={() => {
                if (deleteKeyId) {
                  deleteKey(deleteKeyId);
                  setDeleteKeyId(null);
                }
              }}
              disabled={isDeleting}
            >
              {isDeleting ? "Deleting..." : "Delete Key"}
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}

export default function KeysPage() {
  return (
    <Suspense fallback={
      <div className="flex items-center justify-center min-h-[40vh]">
        <div className='w-10 h-10 animate-spin rounded-full border-2 border-solid border-current border-t-transparent mx-auto text-primary-sendlib' />
      </div>
    }>
      <KeysContent />
    </Suspense>
  );
}
