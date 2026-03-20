"use client";

import { Mail, CheckCircle2, XCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { useGmailAccounts, useConnectGmail, useDisconnectGmail } from "@/hooks/useGmailAccounts";

export default function AccountsPage() {
  const { data: accounts, isLoading } = useGmailAccounts();
  const { mutate: connectGmail, isPending: isConnecting } = useConnectGmail();
  const { mutate: disconnectGmail, isPending: isDisconnecting } = useDisconnectGmail();

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Gmail Accounts</h1>
          <p className="text-muted-foreground mt-1">
            Connect and manage the Gmail accounts used for sending emails.
          </p>
        </div>
        <Button 
          className="font-semibold shadow-md" 
          onClick={() => connectGmail()}
          disabled={isConnecting || (accounts && accounts.length > 0 && accounts[0].connected)}
        >
          <Mail className="w-4 h-4 mr-2" />
          Connect New Account
        </Button>
      </div>

      <div className="rounded-lg border border-amber-200 bg-amber-50 dark:bg-amber-950/20 dark:border-amber-900/50 p-4">
        <div className="flex gap-3">
          <div className="text-amber-600 dark:text-amber-500 shrink-0">
            <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
            </svg>
          </div>
          <div className="flex-1">
            <h3 className="font-semibold text-amber-900 dark:text-amber-200 text-sm mb-1">Gmail Sending Limits</h3>
            <p className="text-sm text-amber-800 dark:text-amber-300 leading-relaxed">
              Gmail accounts can send up to <span className="font-bold">500 emails per day</span> (Google Workspace: 2,000/day). 
              For unlimited sending, configure SMTP with your custom domain in Settings.
            </p>
          </div>
        </div>
      </div>

      {isLoading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <Skeleton className="h-24 w-full rounded-xl" />
          <Skeleton className="h-24 w-full rounded-xl" />
        </div>
      ) : !accounts || accounts.length === 0 ? (
        <div className="rounded-xl border border-border bg-card p-8 text-center text-muted-foreground shadow-sm">
          <Mail className="w-12 h-12 mx-auto mb-4 opacity-50" />
          <h3 className="text-lg font-medium text-foreground mb-1">No accounts connected</h3>
          <p className="max-w-sm mx-auto mb-6">Connect a Gmail account to start sending emails on its behalf.</p>
          <Button 
            variant="outline" 
            className="font-medium shadow-sm" 
            onClick={() => connectGmail()}
            disabled={isConnecting}
          >
            Connect Account
          </Button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {accounts.map((account) => (
            <div key={account.id} className="rounded-xl border border-border bg-card p-6 shadow-sm flex flex-col sm:flex-row sm:items-center gap-4">
              <div className={`h-12 w-12 rounded-full flex items-center justify-center shrink-0 ${account.connected ? "bg-primary/10 text-primary" : "bg-destructive/10 text-destructive"}`}>
                <Mail className="h-6 w-6" />
              </div>
              <div className="flex-1 min-w-0">
                <h3 className="font-semibold text-foreground truncate">{account.email}</h3>
                <p className={`text-sm font-medium flex items-center gap-1 mt-1 ${account.connected ? "text-emerald-600 dark:text-emerald-400" : "text-destructive"}`}>
                  {account.connected ? (
                    <><CheckCircle2 className="h-3.5 w-3.5" /> Connected</>
                  ) : (
                    <><XCircle className="h-3.5 w-3.5" /> Disconnected</>
                  )}
                </p>
                <p className="text-xs text-muted-foreground mt-1 text-opacity-70">
                  Added on {new Date(account.created_at).toLocaleDateString()}
                </p>
              </div>
              {account.connected && (
                <Button 
                  variant="outline" 
                  size="sm" 
                  className="mt-2 sm:mt-0 self-start sm:self-center"
                  onClick={() => {
                    if (confirm("Disconnect this Gmail account? You can reconnect it later.")) {
                      disconnectGmail();
                    }
                  }}
                  disabled={isDisconnecting}
                >
                  Disconnect
                </Button>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
