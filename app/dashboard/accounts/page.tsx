"use client";

import { HugeiconsIcon } from '@hugeicons/react';
import { MailIcon, CheckmarkCircle01Icon, CancelCircleIcon } from '@hugeicons/core-free-icons';
import { useState, useEffect } from "react";
import Link from "next/link";
import { useSearchParams, useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { useGmailAccounts, useConnectGmail, useDisconnectGmail } from "@/hooks/useGmailAccounts";
import { toast } from "sonner";
import confetti from "canvas-confetti";

function redactEmail(email: string): string {
  const [localPart, domain] = email.split("@");
  if (!localPart || !domain) return email;
  if (localPart.length <= 2) {
    return `${localPart[0]}***@${domain}`;
  }
  return `${localPart[0]}***${localPart[localPart.length - 1]}@${domain}`;
}

export default function AccountsPage() {
  const { data: accounts, isLoading } = useGmailAccounts();
  const { mutate: connectGmail, isPending: isConnecting } = useConnectGmail();
  const { mutate: disconnectGmail, isPending: isDisconnecting } = useDisconnectGmail();
  const [connectConfirmOpen, setConnectConfirmOpen] = useState(false);
  const [disconnectEmail, setDisconnectEmail] = useState<string | null>(null);
  const [successDialogOpen, setSuccessDialogOpen] = useState(false);

  const searchParams = useSearchParams();
  const router = useRouter();

  useEffect(() => {
    if (searchParams.get("gmail_connected") === "true") {
      confetti({
        particleCount: 300,
        spread: 120,
        origin: { y: 0.6 }
      });
      setSuccessDialogOpen(true);
      toast.success("Gmail account connected successfully!");

      const newUrl = window.location.pathname;
      window.history.replaceState({}, document.title, newUrl);
    } else if (searchParams.get("gmail_updated") === "true") {
      const email = searchParams.get("email");
      toast.success(
        email 
          ? `Gmail account (${email}) re-authenticated & tokens updated!` 
          : "Gmail account re-authenticated & tokens updated!"
      );

      const newUrl = window.location.pathname;
      window.history.replaceState({}, document.title, newUrl);
    }
  }, [searchParams]);

  const atAccountLimit = !isLoading && !!accounts && accounts.length >= 5;

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-3xl font-headline-md font-bold tracking-tight text-primary-sendlib">Gmail Accounts</h1>
          <p className="text-secondary font-body-md mt-1">
            Connect and manage the Gmail accounts used for sending emails.
          </p>
          {!isLoading && accounts && (
            <p className="text-xs mt-1.5 font-medium">
              <span className={atAccountLimit ? "text-destructive font-bold" : "text-secondary"}>
                {accounts.length} / 5 accounts connected
              </span>
            </p>
          )}
        </div>
        <Button
          size="lg"
          className="rounded-lg font-label-sm bg-primary-sendlib hover:bg-primary-sendlib/90 text-white shadow-sm transition-all active:scale-95 cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
          onClick={() => setConnectConfirmOpen(true)}
          disabled={isConnecting || atAccountLimit}
          title={atAccountLimit ? "You've reached the 5-account limit" : undefined}
        >
          <HugeiconsIcon icon={MailIcon} size={16} color='currentColor' strokeWidth={1.5} />
          <span className="ml-2">{atAccountLimit ? "Account Limit Reached" : "Connect New Account"}</span>
        </Button>
      </div>

      <div className="rounded-xl border border-indigo-100 bg-indigo-50/50 p-4">
        <div className="flex gap-3">
          <div className="flex-1">
            <h3 className="font-semibold text-primary-sendlib text-sm mb-1">Gmail Sending Limits</h3>
            <p className="text-sm text-secondary leading-relaxed">
              Standard Gmail accounts can send up to <span className="font-bold">500 emails per day</span>. Google Workspace custom domain accounts can send up to <span className="font-bold">2,000 emails per day</span>.
            </p>
          </div>
        </div>
      </div>

      {isLoading ? (
        <div className="space-y-4">
          <Skeleton className="h-24 w-full rounded-xl" />
          <Skeleton className="h-24 w-full rounded-xl" />
        </div>
      ) : !accounts || accounts.length === 0 ? (
        <div className="rounded-xl border border-[#e2e9b0]/60 bg-[#f7fae0]/35 p-8 text-center shadow-none">
          <HugeiconsIcon icon={MailIcon} size={48} color='currentColor' strokeWidth={1.5} className="mx-auto mb-4 text-[#8a991a]" />
          <h3 className="text-lg font-headline-md font-bold text-[#5b6a05] mb-1">No accounts connected</h3>
          <p className="max-w-[420px] mx-auto mb-6 text-sm text-[#738210] leading-relaxed">Connect a Gmail account to start sending emails on its behalf.</p>
          <Button 
            size="lg"
            className="rounded-lg font-label-sm bg-[#5b6a05] hover:bg-[#5b6a05]/90 text-white shadow-sm transition-all active:scale-95 cursor-pointer" 
            onClick={() => connectGmail()}
            disabled={isConnecting}
          >
            <HugeiconsIcon icon={MailIcon} size={16} color='currentColor' strokeWidth={1.5} />
            {isConnecting ? "Connecting..." : "Connect Gmail Account"}
          </Button>
        </div>
      ) : (
        <div className="rounded-xl border border-[#bbf3ee]/50 bg-[#e6fbf9]/15 overflow-hidden hover:bg-[#e6fbf9]/25 transition-colors">
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="border-b border-[#bbf3ee]/50 bg-[#bbf3ee]/25">
                  <th className="px-6 py-3.5 text-xs font-bold uppercase tracking-wider text-[#0f685c]">Gmail Address</th>
                  <th className="px-6 py-3.5 text-xs font-bold uppercase tracking-wider text-[#0f685c]">Status</th>
                  <th className="px-6 py-3.5 text-xs font-bold uppercase tracking-wider text-[#0f685c]">Connected</th>
                  <th className="px-6 py-3.5 text-right text-xs font-bold uppercase tracking-wider text-[#0f685c] pr-6"></th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#bbf3ee]/35">
                {accounts.map((account) => (
                  <tr key={account.id} className="hover:bg-[#bbf3ee]/15 transition-colors">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center gap-2">
                        <HugeiconsIcon icon={MailIcon} size={16} color='currentColor' strokeWidth={1.5} className="text-[#0d9488]" />
                        <span className="font-bold text-[#044e45]">{redactEmail(account.email)}</span>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      {account.connected ? (
                        <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-label-xs border border-emerald-200 bg-emerald-50 text-emerald-700">
                          <HugeiconsIcon icon={CheckmarkCircle01Icon} size={12} color='currentColor' strokeWidth={1.5} /> Connected
                        </span>
                      ) : (
                        <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-label-xs border border-destructive/20 bg-destructive/10 text-destructive">
                          <HugeiconsIcon icon={CancelCircleIcon} size={12} color='currentColor' strokeWidth={1.5} /> Disconnected
                        </span>
                      )}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-xs text-[#0f685c] font-medium">
                      {new Date(account.connectedAt).toLocaleDateString()}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-right pr-6">
                      <Button 
                        variant="outline" 
                        size="sm" 
                        className="rounded-lg font-label-sm border border-[#bbf3ee] bg-white text-destructive hover:bg-destructive/10 px-3 h-8 cursor-pointer"
                        onClick={() => setDisconnectEmail(account.email)}
                        disabled={isDisconnecting}
                      >
                        Disconnect
                      </Button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Gmail Connected Success Dialog */}
      <Dialog open={successDialogOpen} onOpenChange={setSuccessDialogOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader className="mb-2">
            <DialogTitle className="text-xl font-headline-md font-bold text-primary-sendlib flex items-center gap-2">
              <span>🎉</span> Gmail Connected!
            </DialogTitle>
            <DialogDescription className="text-secondary text-sm leading-relaxed mt-1">
              Your Gmail account has been successfully linked. Next up, generate an API Key to start sending emails.
            </DialogDescription>
          </DialogHeader>
          <div className="flex flex-row gap-3 mt-4 pt-4 border-t border-outline-variant/60">
            <Button 
              variant="outline" 
              className="flex-1 rounded-lg font-label-sm border border-outline-variant hover:bg-surface-container-low cursor-pointer" 
              onClick={() => setSuccessDialogOpen(false)}
            >
              Dismiss
            </Button>
            <Link href="/dashboard/keys" className="flex-1">
              <Button 
                className="w-full rounded-lg font-label-sm bg-primary-sendlib hover:bg-primary-sendlib/90 text-white cursor-pointer" 
              >
                Create API Key
              </Button>
            </Link>
          </div>
        </DialogContent>
      </Dialog>

      <Dialog open={connectConfirmOpen} onOpenChange={setConnectConfirmOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader className="mb-2">
            <DialogTitle className="text-xl font-headline-md font-bold text-primary-sendlib">Connect Gmail Account</DialogTitle>
            <DialogDescription className="text-secondary text-sm leading-relaxed mt-1">
              Connect your Google account via secure OAuth 2.0. SendLib will only request the narrow permissions required to relay transactional emails on your behalf, and your credentials are never seen or stored.
            </DialogDescription>
          </DialogHeader>
          <div className="flex flex-row gap-3 mt-4 pt-4 border-t border-outline-variant/60">
            <Button 
              variant="outline" 
              className="flex-1 rounded-lg font-label-sm border border-outline-variant hover:bg-surface-container-low cursor-pointer" 
              onClick={() => setConnectConfirmOpen(false)}
            >
              Cancel
            </Button>
            <Button 
              className="flex-1 rounded-lg font-label-sm bg-primary-sendlib hover:bg-primary-sendlib/90 text-white cursor-pointer" 
              onClick={() => {
                setConnectConfirmOpen(false);
                toast.loading("Redirecting to Google...", { id: "gmail-connect" });
                connectGmail();
              }}
              disabled={isConnecting}
            >
              Connect Gmail
            </Button>
          </div>
        </DialogContent>
      </Dialog>

      {/* Disconnect Gmail Confirmation Dialog */}
      <Dialog open={!!disconnectEmail} onOpenChange={(open) => !open && setDisconnectEmail(null)}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader className="mb-2">
            <DialogTitle className="text-xl font-headline-md font-bold text-destructive">Disconnect Gmail Account</DialogTitle>
            <DialogDescription className="text-secondary text-sm leading-relaxed mt-1">
              Are you sure you want to disconnect **{disconnectEmail}**? SendLib will no longer be able to send transactional emails on behalf of this account.
            </DialogDescription>
          </DialogHeader>
          <div className="flex flex-row gap-3 mt-4 pt-4 border-t border-outline-variant/60">
            <Button 
              variant="outline" 
              className="flex-1 rounded-lg font-label-sm border border-outline-variant hover:bg-surface-container-low cursor-pointer" 
              onClick={() => setDisconnectEmail(null)}
            >
              Cancel
            </Button>
            <Button 
              className="flex-1 rounded-lg font-label-sm bg-destructive hover:bg-destructive/90 text-white cursor-pointer" 
              onClick={() => {
                if (disconnectEmail) {
                  const targetEmail = disconnectEmail;
                  setDisconnectEmail(null);
                  toast.success(`Disconnected ${targetEmail}`);
                  disconnectGmail(targetEmail);
                }
              }}
              disabled={isDisconnecting}
            >
              {isDisconnecting ? "Disconnecting..." : "Disconnect"}
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}
