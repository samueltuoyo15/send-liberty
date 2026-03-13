"use client";

import { Mail, CheckCircle2, XCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { useGmailAccounts } from "@/hooks/useGmailAccounts";

export default function AccountsPage() {
  const { data: accounts, isLoading } = useGmailAccounts();
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
          <Button variant="outline" className="font-medium shadow-sm">Connect Account</Button>
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
              <Button variant="outline" size="sm" className="mt-2 sm:mt-0 self-start sm:self-center">Manage</Button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
