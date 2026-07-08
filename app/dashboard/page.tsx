"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import { HugeiconsIcon } from '@hugeicons/react';
import { 
  Key01Icon, 
  MailIcon, 
  FileTypeIcon,
  CheckmarkCircle01Icon,
  CancelCircleIcon,
  Refresh01Icon,
  Copy01Icon,
} from '@hugeicons/core-free-icons';
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { useMe } from "@/hooks/useAuth";
import { useApiKeys, useGenerateApiKey } from "@/hooks/useApiKeys";
import { useGmailAccounts, useConnectGmail } from "@/hooks/useGmailAccounts";
import { useEmailLogs } from "@/hooks/useEmailLogs";
import { useState, useEffect } from "react";
import confetti from "canvas-confetti";
import { Sheet, SheetContent, SheetDescription, SheetHeader, SheetTitle, SheetFooter } from "@/components/ui/sheet";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { toast } from "sonner";

function redactEmail(email?: string): string {
  if (!email) return "None connected";
  const [localPart, domain] = email.split("@");
  if (!localPart || !domain) return email;
  if (localPart.length <= 2) {
    return `${localPart[0]}***@${domain}`;
  }
  return `${localPart[0]}***${localPart[localPart.length - 1]}@${domain}`;
}

export default function DashboardPage() {
  const { data: user, isLoading: isLoadingUser, refetch: refetchUser } = useMe();
  const { data: apiKeys, isLoading: isLoadingKeys } = useApiKeys();
  const { data: gmailAccounts, isLoading: isLoadingAccounts } = useGmailAccounts();
  const { data: logsData, isLoading: isLoadingLogs, refetch: refetchLogs, isFetching: isFetchingLogs } = useEmailLogs(1, 5);
  const { mutate: connectGmail, isPending: isConnecting } = useConnectGmail();
  const [newKeyDialog, setNewKeyDialog] = useState<{ key: string; hint: string } | null>(null);
  const [connectConfirmOpen, setConnectConfirmOpen] = useState(false);
  const [milestoneDialogOpen, setMilestoneDialogOpen] = useState(false);
  const activeKeysCount = apiKeys?.filter(k => !k.revoked).length || 0;
  const connectedGmailsCount = gmailAccounts?.filter(g => g.connected).length || 0;
  const emailLogs = Array.isArray(logsData?.data) ? logsData.data : [];
  const totalEmailsSent = logsData?.meta?.total ?? 0;

  useEffect(() => {
    if (!isLoadingAccounts && connectedGmailsCount > 0) {
      const seen = localStorage.getItem("sendliberty_confetti_step1_seen");
      if (!seen) {
        confetti({
          particleCount: 300,
          spread: 120,
          origin: { y: 0.6 }
        });
        setMilestoneDialogOpen(true);
        localStorage.setItem("sendliberty_confetti_step1_seen", "true");
      }
    }
  }, [isLoadingAccounts, connectedGmailsCount]);

  return (
    <div className="space-y-6">
      {/* Welcome & Actions */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <motion.div 
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          className="space-y-1"
        >
          <h1 className="text-3xl font-headline-md font-bold tracking-tight text-primary-sendliberty">Overview</h1>
          <p className="text-secondary font-body-md mt-1">Your API relay service is active and running.</p>
        </motion.div>
        
        <motion.div 
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          className="flex items-center gap-3"
        >
          <Button 
            size="lg"
            className="rounded-lg font-label-sm bg-primary-sendliberty hover:bg-primary-sendliberty/90 text-white shadow-sm transition-all active:scale-95 group" 
            onClick={() => {
              setConnectConfirmOpen(true);
            }}
            disabled={isConnecting}
          >
            <HugeiconsIcon icon={MailIcon} size={16} color='currentColor' strokeWidth={1.5} className="group-hover:rotate-12 transition-transform" />
            <span className="ml-2">{isConnecting ? "Connecting..." : "Connect Account"}</span>
          </Button>
          <Link href="/dashboard/keys?generate=true">
            <Button 
              size="lg"
              variant="outline" 
              className="rounded-lg font-label-sm border border-outline-variant bg-white text-primary-sendliberty shadow-xs hover:bg-surface-container-low transition-all active:scale-95"
            >
              <HugeiconsIcon icon={Key01Icon} size={16} color='currentColor' strokeWidth={1.5} />
              <span className="ml-2">Generate Key</span>
            </Button>
          </Link>
        </motion.div>
      </div>

      {/* Main Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="md:col-span-1"
        >
          <Card className="h-full border-[#d3c5ff]/60 bg-[#f0ebff]/60 shadow-none hover:bg-[#f0ebff]/85 transition-colors rounded-xl">
            <CardHeader className="pb-2 flex flex-row items-center justify-between">
              <CardTitle className="text-xs font-label-xs uppercase tracking-wider text-[#4a358c]/80">Emails Sent</CardTitle>
              <HugeiconsIcon icon={FileTypeIcon} size={18} color='currentColor' strokeWidth={1.5} className="text-[#5a36cf]" />
            </CardHeader>
            <CardContent>
              {isLoadingLogs ? (
                <div className="space-y-3">
                  <Skeleton className="h-10 w-24 bg-[#d3c5ff]/35" />
                  <Skeleton className="h-3 w-32 bg-[#d3c5ff]/35" />
                </div>
              ) : (
                <>
                  <div className="text-4xl font-headline-md font-bold tracking-tight text-[#2c1075]">
                    {totalEmailsSent.toLocaleString()}
                  </div>
                  <p className="text-sm text-[#4a358c] mt-3 font-medium flex items-center gap-1.5">
                    <HugeiconsIcon icon={CheckmarkCircle01Icon} size={14} color='currentColor' strokeWidth={1.5} className="text-[#5a36cf]" /> Relay API is fully active
                  </p>
                </>
              )}
            </CardContent>
          </Card>
        </motion.div>
        
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
        >
          <Card className="h-full border-[#bbf3ee]/60 bg-[#e6fbf9]/60 shadow-none hover:bg-[#e6fbf9]/85 transition-colors rounded-xl">
            <CardHeader className="pb-2 flex flex-row items-center justify-between">
              <CardTitle className="text-xs font-label-xs uppercase tracking-wider text-[#136e63]">Active API Keys</CardTitle>
              <HugeiconsIcon icon={Key01Icon} size={18} color='currentColor' strokeWidth={1.5} className="text-[#0fa290]" />
            </CardHeader>
            <CardContent>
              {isLoadingKeys ? (
                <div className="space-y-3">
                  <Skeleton className="h-10 w-16 bg-[#bbf3ee]/35" />
                  <Skeleton className="h-3 w-3/4 bg-[#bbf3ee]/35" />
                </div>
              ) : (
                <>
                  <div className="text-4xl font-headline-md font-bold tracking-tight text-[#044e45]">{activeKeysCount}</div>
                  <p className="text-sm text-[#136e63] mt-3 font-medium flex items-center gap-1.5">
                    <HugeiconsIcon icon={CheckmarkCircle01Icon} size={14} color='currentColor' strokeWidth={1.5} className="text-[#0fa290]" /> {activeKeysCount > 0 ? "Keys are active" : "No active keys"}
                  </p>
                </>
              )}
            </CardContent>
          </Card>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
        >
          <Card className="h-full border-[#ffd0e3]/60 bg-[#fff0f6]/60 shadow-none hover:bg-[#fff0f6]/85 transition-colors rounded-xl">
            <CardHeader className="pb-2 flex flex-row items-center justify-between">
              <CardTitle className="text-xs font-label-xs uppercase tracking-wider text-[#a61b58]/80">Connected Gmails</CardTitle>
              <HugeiconsIcon icon={MailIcon} size={18} color='currentColor' strokeWidth={1.5} className="text-[#d62272]" />
            </CardHeader>
            <CardContent>
              {isLoadingAccounts ? (
                <div className="space-y-3">
                  <Skeleton className="h-10 w-12 bg-[#ffd0e3]/35" />
                  <Skeleton className="h-3 w-full bg-[#ffd0e3]/35" />
                </div>
              ) : (
                <>
                  <div className="text-4xl font-headline-md font-bold tracking-tight text-[#780536]">{connectedGmailsCount}</div>
                  <p className="text-sm text-[#a61b58] mt-3 font-medium truncate">
                    {connectedGmailsCount === 0 
                      ? "None connected" 
                      : connectedGmailsCount === 1 
                        ? redactEmail(gmailAccounts?.find(g => g.connected)?.email) 
                        : `${connectedGmailsCount} accounts connected`}
                  </p>
                </>
              )}
            </CardContent>
          </Card>
        </motion.div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 items-stretch">
        {/* Recent Logs List */}
        <motion.div
           initial={{ opacity: 0, y: 20 }}
           animate={{ opacity: 1, y: 0 }}
           transition={{ delay: 0.4 }}
           className="lg:col-span-2 flex flex-col"
        >
          <Card className="h-full flex flex-col border-[#1d2b3e]/15 bg-[#1d2b3e]/[0.02] shadow-none rounded-xl overflow-hidden hover:bg-[#1d2b3e]/[0.04] transition-colors">
            <CardHeader className="flex flex-row items-center justify-between pb-4">
              <CardTitle className="text-lg font-headline-md font-bold text-[#1d2b3e]">Recent Email Logs</CardTitle>
              <Button 
                variant="ghost" 
                size="sm" 
                className="font-semibold h-8 w-8 p-0 text-[#1d2b3e]/75 hover:text-[#1d2b3e] hover:bg-[#1d2b3e]/10 rounded-lg cursor-pointer"
                onClick={() => refetchLogs()}
              >
                <HugeiconsIcon 
                  icon={Refresh01Icon} 
                  size={16} 
                  color='currentColor' 
                  strokeWidth={1.5} 
                  className={isFetchingLogs ? "animate-spin text-[#1d2b3e]" : "text-[#1d2b3e]/80"} 
                />
              </Button>
            </CardHeader>
            <CardContent className="p-0 flex-1">
              <Table>
                <TableHeader className="bg-[#1d2b3e]/5 border-y border-[#1d2b3e]/10">
                  <TableRow className="border-[#1d2b3e]/10 hover:bg-transparent">
                    <TableHead className="font-label-sm font-bold pl-6 text-[#1d2b3e]">To / Subject</TableHead>
                    <TableHead className="font-label-sm font-bold text-[#1d2b3e]">Status</TableHead>
                    <TableHead className="font-label-sm font-bold text-right pr-6 text-[#1d2b3e]">Date</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {isLoadingLogs || isFetchingLogs ? (
                    Array.from({ length: 3 }).map((_, i) => (
                      <TableRow key={i} className="border-[#1d2b3e]/10">
                        <TableCell className="pl-6 py-4"><Skeleton className="h-8 w-full max-w-[200px] bg-[#1d2b3e]/10" /></TableCell>
                        <TableCell><Skeleton className="h-5 w-16 bg-[#1d2b3e]/10" /></TableCell>
                        <TableCell className="pr-6"><Skeleton className="h-4 w-24 ml-auto bg-[#1d2b3e]/10" /></TableCell>
                      </TableRow>
                    ))
                  ) : emailLogs.length === 0 ? (
                    <TableRow>
                      <TableCell colSpan={3} className="text-center py-10">
                        <div className="flex flex-col items-center justify-center max-w-[380px] mx-auto space-y-2.5">
                          <HugeiconsIcon icon={FileTypeIcon} size={40} color='currentColor' strokeWidth={1.5} className="text-[#1d2b3e] opacity-40 mb-0.5" />
                          <h4 className="text-base font-headline-md font-bold text-[#1d2b3e]">No email logs found</h4>
                          <p className="text-xs text-[#1d2b3e]/80 leading-relaxed">
                            Sent emails will appear here automatically once you send through the SendLiberty API.
                          </p>
                          <div className="pt-1 flex items-center gap-2.5">
                            <Link href="/docs/send">
                              <Button variant="outline" size="sm" className="rounded-lg font-label-sm border border-[#1d2b3e]/30 bg-white text-[#1d2b3e] shadow-xs hover:bg-[#1d2b3e]/5 px-3.5 h-8">
                                View API Docs
                              </Button>
                            </Link>
                            <Link href="/dashboard/keys?generate=true">
                              <Button size="sm" className="rounded-lg font-label-sm bg-[#1d2b3e] hover:bg-[#1d2b3e]/90 text-white shadow-sm px-3.5 h-8">
                                Get API Key
                              </Button>
                            </Link>
                          </div>
                        </div>
                      </TableCell>
                    </TableRow>
                  ) : (
                    emailLogs.map((log: any) => (
                      <TableRow key={log.id} className="border-[#1d2b3e]/10 transition-colors hover:bg-[#1d2b3e]/5 group">
                        <TableCell className="pl-6 py-4">
                          <div className="flex flex-col">
                            <span className="font-bold text-sm text-[#1d2b3e]">{log.to}</span>
                            <span className="text-xs text-[#1d2b3e]/75 mt-0.5 truncate max-w-[200px]">{log.subject}</span>
                          </div>
                        </TableCell>
                        <TableCell>
                          <Badge 
                            variant={log.status === "sent" ? "outline" : "secondary"} 
                            className={`
                              font-semibold rounded-md tracking-wider text-[10px] border-border
                              ${log.status === "failed" ? "bg-destructive/10 text-destructive border-transparent" : "bg-[#e6fbf9]/60 text-emerald-700 border-[#bbf3ee] dark:bg-emerald-500/10 dark:text-emerald-400 dark:border-emerald-500/20"}
                            `}
                          >
                            {log.status === "sent" && <HugeiconsIcon icon={CheckmarkCircle01Icon} size={12} color='currentColor' strokeWidth={1.5} className="mr-1" />}
                            {log.status === "failed" && <HugeiconsIcon icon={CancelCircleIcon} size={12} color='currentColor' strokeWidth={1.5} className="mr-1" />}
                            {log.status}
                          </Badge>
                        </TableCell>
                        <TableCell className="text-sm text-[#1d2b3e]/80 font-medium text-right pr-6">
                          {new Date(log.created_at).toLocaleDateString()} {new Date(log.created_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                        </TableCell>
                      </TableRow>
                    ))
                  )}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </motion.div>

        {/* Action Widgets */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
          className="flex flex-col"
        >
          <Card className="h-full flex flex-col border-[#1d2b3e]/15 bg-[#1d2b3e]/[0.02] shadow-none rounded-xl hover:bg-[#1d2b3e]/[0.04] transition-colors">
            <CardHeader className="pb-3">
              <CardTitle className="text-xs font-label-xs uppercase tracking-wider text-[#1d2b3e]/80">Setup Guide</CardTitle>
            </CardHeader>
            <CardContent className="flex-1 flex flex-col justify-center pb-6 px-6 space-y-0 gap-1">
              {/* Step 1 */}
              <div className="flex gap-4 items-start">
                <div className="flex flex-col items-center shrink-0">
                  <div className={`w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold transition-colors duration-300 z-10 ${
                    connectedGmailsCount > 0 ? "bg-[#1d2b3e] text-white" : "border border-[#1d2b3e]/35 bg-white text-[#1d2b3e]"
                  }`}>
                    1
                  </div>
                  <div className={`w-0.5 h-10 my-1 transition-colors duration-300 ${connectedGmailsCount > 0 ? "bg-[#1d2b3e]" : "bg-[#1d2b3e]/20"}`} />
                </div>
                <div className="pt-0.5">
                  <h4 className={`font-bold text-sm transition-colors duration-300 ${connectedGmailsCount > 0 ? "text-[#1d2b3e]" : "text-[#1d2b3e]/80"}`}>Connect Gmail</h4>
                  <p className="text-xs text-[#1d2b3e]/70 mt-0.5 leading-snug">Authorize your Google account for sending.</p>
                </div>
              </div>

              {/* Step 2 */}
              <div className="flex gap-4 items-start">
                <div className="flex flex-col items-center shrink-0">
                  <div className={`w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold transition-colors duration-300 z-10 ${
                    activeKeysCount > 0 ? "bg-[#1d2b3e] text-white" : "border border-[#1d2b3e]/35 bg-white text-[#1d2b3e]"
                  }`}>
                    2
                  </div>
                  <div className={`w-0.5 h-10 my-1 transition-colors duration-300 ${activeKeysCount > 0 ? "bg-[#1d2b3e]" : "bg-[#1d2b3e]/20"}`} />
                </div>
                <div className="pt-0.5">
                  <h4 className={`font-bold text-sm transition-colors duration-300 ${activeKeysCount > 0 ? "text-[#1d2b3e]" : "text-[#1d2b3e]/80"}`}>Get API Key</h4>
                  <p className="text-xs text-[#1d2b3e]/70 mt-0.5 leading-snug">Generate a secret key to authenticate your requests.</p>
                </div>
              </div>

              {/* Step 3 */}
              <div className="flex gap-4 items-start">
                <div className="flex flex-col items-center shrink-0">
                  <div className={`w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold transition-colors duration-300 z-10 ${
                    totalEmailsSent > 0 ? "bg-[#1d2b3e] text-white" : "border border-[#1d2b3e]/35 bg-white text-[#1d2b3e]"
                  }`}>
                    3
                  </div>
                </div>
                <div className="pt-0.5">
                  <h4 className={`font-bold text-sm transition-colors duration-300 ${totalEmailsSent > 0 ? "text-[#1d2b3e]" : "text-[#1d2b3e]/80"}`}>Send Emails</h4>
                  <p className="text-xs text-[#1d2b3e]/70 mt-0.5 leading-snug">Use our REST API to send emails seamlessly.</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </motion.div>
      </div>

      {/* Generated Key Slide-over Drawer */}
      <Sheet open={!!newKeyDialog} onOpenChange={() => setNewKeyDialog(null)}>
        <SheetContent side="right" className="w-full sm:max-w-md border-l border-outline-variant p-6 bg-surface-container-lowest">
          <SheetHeader className="p-0 mb-6">
            <SheetTitle className="text-xl font-headline-md font-bold text-primary-sendliberty">API Key Generated</SheetTitle>
            <SheetDescription className="text-secondary text-sm">
              Copy your new secret key below. For security reasons, you won't be able to view it again.
            </SheetDescription>
          </SheetHeader>
          <div className="space-y-5">
            <div>
              <label className="text-sm font-label-sm font-semibold text-on-background mb-2 block">Your API Key</label>
              <div className="font-mono bg-surface-container-low p-3.5 rounded-lg text-sm break-all border border-outline-variant text-primary-sendliberty selection:bg-primary-sendliberty selection:text-white">
                {newKeyDialog?.key}
              </div>
            </div>
          </div>
          <SheetFooter className="p-0 mt-6 pt-4 border-t border-outline-variant">
            <Button 
              className="w-full rounded-lg font-label-sm bg-primary-sendliberty hover:bg-primary-sendliberty/90 text-white py-2.5" 
              onClick={() => {
                navigator.clipboard.writeText(newKeyDialog?.key || "");
                toast.success("API Key copied to clipboard!");
                setNewKeyDialog(null);
              }}
            >
              <HugeiconsIcon icon={Copy01Icon} size={16} color='currentColor' strokeWidth={1.5} className="mr-2" />
              Copy to Clipboard & Close
            </Button>
          </SheetFooter>
        </SheetContent>
      </Sheet>

      {/* Connect Account Confirmation Dialog */}
      <Dialog open={connectConfirmOpen} onOpenChange={setConnectConfirmOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader className="mb-2">
            <DialogTitle className="text-xl font-headline-md font-bold text-primary-sendliberty">Connect Gmail Account</DialogTitle>
            <DialogDescription className="text-secondary text-sm leading-relaxed mt-1">
              Connect your Google account via secure OAuth 2.0. SendLiberty will only request the narrow permissions required to relay transactional emails on your behalf, and your credentials are never seen or stored.
            </DialogDescription>
          </DialogHeader>
          <div className="flex flex-row gap-3 mt-4 pt-4 border-t border-outline-variant/60">
            <Button 
              variant="outline" 
              className="flex-1 rounded-lg font-label-sm border border-outline-variant hover:bg-surface-container-low" 
              onClick={() => setConnectConfirmOpen(false)}
            >
              Cancel
            </Button>
            <Button 
              className="flex-1 rounded-lg font-label-sm bg-primary-sendliberty hover:bg-primary-sendliberty/90 text-white" 
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

      {/* Setup Guide Milestone Dialog */}
      <Dialog open={milestoneDialogOpen} onOpenChange={setMilestoneDialogOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader className="mb-2">
            <DialogTitle className="text-xl font-headline-md font-bold text-primary-sendliberty flex items-center gap-2">
              <span>🎉</span> Step 1 Complete!
            </DialogTitle>
            <DialogDescription className="text-secondary text-sm leading-relaxed mt-1">
              You've successfully connected your Gmail account! Next up: Generate an API Key to authorize email requests from your app.
            </DialogDescription>
          </DialogHeader>
          <div className="flex flex-row gap-3 mt-4 pt-4 border-t border-[#1d2b3e]/10">
            <Button 
              variant="outline" 
              className="flex-1 rounded-lg font-label-sm border border-outline-variant hover:bg-surface-container-low cursor-pointer" 
              onClick={() => setMilestoneDialogOpen(false)}
            >
              Dismiss
            </Button>
            <Link href="/dashboard/keys" className="flex-1">
              <Button 
                className="w-full rounded-lg font-label-sm bg-primary-sendliberty hover:bg-primary-sendliberty/90 text-white cursor-pointer" 
              >
                Go to API Keys
              </Button>
            </Link>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}
