"use client";

import { Mail, CheckCircle2, XCircle, Server, Shield } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { Input } from "@/components/ui/input";
import { useGmailAccounts, useConnectGmail, useDisconnectGmail } from "@/hooks/useGmailAccounts";
import { useState } from "react";

export default function ServicesPage() {
  const [activeTab, setActiveTab] = useState<"gmail" | "smtp">("gmail");
  const { data: accounts, isLoading } = useGmailAccounts();
  const { mutate: connectGmail, isPending: isConnecting } = useConnectGmail();
  const { mutate: disconnectGmail, isPending: isDisconnecting } = useDisconnectGmail();

  const [smtpConfig, setSmtpConfig] = useState({
    host: "",
    port: "587",
    username: "",
    password: "",
    from_email: "",
    from_name: "",
  });

  const handleSaveSmtp = () => {
    console.log("Save SMTP config:", smtpConfig);
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Email Services</h1>
        <p className="text-muted-foreground mt-1">
          Configure Gmail OAuth2 or custom SMTP for sending emails.
        </p>
      </div>

      {/* Tabs */}
      <div className="border-b border-border">
        <div className="flex gap-6">
          <button
            onClick={() => setActiveTab("gmail")}
            className={`pb-3 px-1 font-semibold text-sm transition-colors relative ${
              activeTab === "gmail"
                ? "text-primary"
                : "text-muted-foreground hover:text-foreground"
            }`}
          >
            <div className="flex items-center gap-2">
              <Mail className="w-4 h-4" />
              Gmail OAuth2
            </div>
            {activeTab === "gmail" && (
              <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-primary" />
            )}
          </button>
          <button
            onClick={() => setActiveTab("smtp")}
            className={`pb-3 px-1 font-semibold text-sm transition-colors relative ${
              activeTab === "smtp"
                ? "text-primary"
                : "text-muted-foreground hover:text-foreground"
            }`}
          >
            <div className="flex items-center gap-2">
              <Server className="w-4 h-4" />
              Custom SMTP
            </div>
            {activeTab === "smtp" && (
              <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-primary" />
            )}
          </button>
        </div>
      </div>

      {/* Gmail Tab */}
      {activeTab === "gmail" && (
        <div className="space-y-6">
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
                  Gmail: <span className="font-bold">500 emails/day</span> • Google Workspace: <span className="font-bold">2,000 emails/day</span>
                  <br />For unlimited sending, use Custom SMTP tab.
                </p>
              </div>
            </div>
          </div>

          <div className="flex justify-between items-center">
            <div>
              <h3 className="font-semibold text-lg">Connected Accounts</h3>
              <p className="text-sm text-muted-foreground">Manage Gmail accounts for OAuth2 sending</p>
            </div>
            <Button 
              className="font-semibold shadow-md" 
              onClick={() => connectGmail()}
              disabled={isConnecting || (accounts && accounts.length > 0 && accounts[0].connected)}
            >
              <Mail className="w-4 h-4 mr-2" />
              Connect Gmail
            </Button>
          </div>

          {isLoading ? (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <Skeleton className="h-24 w-full rounded-xl" />
            </div>
          ) : !accounts || accounts.length === 0 ? (
            <div className="rounded-xl border border-border bg-card p-8 text-center text-muted-foreground shadow-sm">
              <Mail className="w-12 h-12 mx-auto mb-4 opacity-50" />
              <h3 className="text-lg font-medium text-foreground mb-1">No Gmail connected</h3>
              <p className="max-w-sm mx-auto mb-6">Connect your Gmail account via OAuth2. No password required.</p>
              <Button 
                variant="outline" 
                className="font-medium shadow-sm" 
                onClick={() => connectGmail()}
                disabled={isConnecting}
              >
                Connect Gmail
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
                    <p className="text-xs text-muted-foreground mt-1">
                      Added {new Date(account.created_at).toLocaleDateString()}
                    </p>
                  </div>
                  {account.connected && (
                    <Button 
                      variant="outline" 
                      size="sm" 
                      className="mt-2 sm:mt-0 self-start sm:self-center"
                      onClick={() => {
                        if (confirm("Disconnect this Gmail account?")) {
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
      )}

      {/* SMTP Tab */}
      {activeTab === "smtp" && (
        <div className="space-y-6">
          <div className="rounded-lg border border-blue-200 bg-blue-50 dark:bg-blue-950/20 dark:border-blue-900/50 p-4">
            <div className="flex gap-3">
              <div className="text-blue-600 dark:text-blue-500 shrink-0">
                <Shield className="w-5 h-5" />
              </div>
              <div className="flex-1">
                <h3 className="font-semibold text-blue-900 dark:text-blue-200 text-sm mb-1">Unlimited Sending with SMTP</h3>
                <p className="text-sm text-blue-800 dark:text-blue-300 leading-relaxed">
                  Configure your own SMTP server for <span className="font-bold">unlimited emails per day</span>. 
                  Perfect for high-volume sending and custom domain branding.
                </p>
              </div>
            </div>
          </div>

          <div className="rounded-xl border border-border bg-card shadow-sm p-6">
            <h3 className="font-semibold text-lg mb-4">SMTP Configuration</h3>
            <div className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="text-sm font-medium mb-1.5 block">
                    SMTP Host
                  </label>
                  <Input
                    type="text"
                    placeholder="smtp.example.com"
                    value={smtpConfig.host}
                    onChange={(e) => setSmtpConfig({ ...smtpConfig, host: e.target.value })}
                  />
                </div>
                <div>
                  <label className="text-sm font-medium mb-1.5 block">
                    Port
                  </label>
                  <Input
                    type="text"
                    placeholder="587"
                    value={smtpConfig.port}
                    onChange={(e) => setSmtpConfig({ ...smtpConfig, port: e.target.value })}
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="text-sm font-medium mb-1.5 block">
                    Username
                  </label>
                  <Input
                    type="text"
                    placeholder="your-username"
                    value={smtpConfig.username}
                    onChange={(e) => setSmtpConfig({ ...smtpConfig, username: e.target.value })}
                  />
                </div>
                <div>
                  <label className="text-sm font-medium mb-1.5 block">
                    Password
                  </label>
                  <Input
                    type="password"
                    placeholder="••••••••"
                    value={smtpConfig.password}
                    onChange={(e) => setSmtpConfig({ ...smtpConfig, password: e.target.value })}
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="text-sm font-medium mb-1.5 block">
                    From Email
                  </label>
                  <Input
                    type="email"
                    placeholder="noreply@yourdomain.com"
                    value={smtpConfig.from_email}
                    onChange={(e) => setSmtpConfig({ ...smtpConfig, from_email: e.target.value })}
                  />
                </div>
                <div>
                  <label className="text-sm font-medium mb-1.5 block">
                    From Name
                  </label>
                  <Input
                    type="text"
                    placeholder="Your Company"
                    value={smtpConfig.from_name}
                    onChange={(e) => setSmtpConfig({ ...smtpConfig, from_name: e.target.value })}
                  />
                </div>
              </div>

              <div className="flex gap-3 pt-2">
                <Button onClick={handleSaveSmtp} className="font-semibold">
                  Save Configuration
                </Button>
                <Button variant="outline" className="font-semibold">
                  Test Connection
                </Button>
              </div>
            </div>
          </div>

          <div className="rounded-xl border border-border bg-card shadow-sm p-6">
            <h3 className="font-semibold text-lg mb-3">Domain Verification</h3>
            <p className="text-sm text-muted-foreground mb-4">
              Add these DNS records to verify your domain and improve deliverability:
            </p>
            <div className="space-y-3">
              <div className="rounded-lg border border-border bg-muted/30 p-3">
                <div className="flex items-center justify-between mb-1">
                  <span className="text-xs font-bold text-muted-foreground">SPF Record</span>
                  <span className="text-xs font-mono bg-background px-2 py-0.5 rounded">TXT</span>
                </div>
                <code className="text-xs font-mono block text-foreground break-all">
                  v=spf1 include:_spf.yourdomain.com ~all
                </code>
              </div>
              <div className="rounded-lg border border-border bg-muted/30 p-3">
                <div className="flex items-center justify-between mb-1">
                  <span className="text-xs font-bold text-muted-foreground">DKIM Record</span>
                  <span className="text-xs font-mono bg-background px-2 py-0.5 rounded">TXT</span>
                </div>
                <code className="text-xs font-mono block text-foreground break-all">
                  k=rsa; p=MIGfMA0GCSqGSIb3DQEBAQUAA4GNADCBiQKBgQ...
                </code>
              </div>
              <div className="rounded-lg border border-border bg-muted/30 p-3">
                <div className="flex items-center justify-between mb-1">
                  <span className="text-xs font-bold text-muted-foreground">DMARC Record</span>
                  <span className="text-xs font-mono bg-background px-2 py-0.5 rounded">TXT</span>
                </div>
                <code className="text-xs font-mono block text-foreground break-all">
                  v=DMARC1; p=quarantine; rua=mailto:dmarc@yourdomain.com
                </code>
              </div>
            </div>
            <Button variant="outline" className="mt-4 font-semibold" size="sm">
              Verify DNS Records
            </Button>
          </div>
        </div>
      )}
    </div>
  );
}
