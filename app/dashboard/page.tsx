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

import { useApiKeys } from "@/hooks/useApiKeys";
import { useGmailAccounts, useConnectGmail } from "@/hooks/useGmailAccounts";
import { useEmailLogs, EmailLog } from "@/hooks/useEmailLogs";
import { useMe } from "@/hooks/useAuth";
import { useState, useEffect } from "react";
import confetti from "canvas-confetti";
import { Sheet, SheetContent, SheetDescription, SheetHeader, SheetTitle, SheetFooter } from "@/components/ui/sheet";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { toast } from "sonner";
import { redactEmail } from "@/utils/redact";
import { useAnalytics } from "@/hooks/useAnalytics";

export default function DashboardPage() {
  const { data: apiKeys, isLoading: isLoadingKeys } = useApiKeys();
  const { data: analytics, isLoading: isLoadingAnalytics } = useAnalytics();
  const { data: gmailAccounts, isLoading: isLoadingAccounts } = useGmailAccounts();
  const { data: logsData, isLoading: isLoadingLogs, refetch: refetchLogs, isFetching: isFetchingLogs } = useEmailLogs(1, 5);
  const { mutate: connectGmail, isPending: isConnecting } = useConnectGmail();
  const { data: user, isLoading: isLoadingUser } = useMe();
  const isPro = user?.plan === "pro";
  const [newKeyDialog, setNewKeyDialog] = useState<{ key: string; hint: string } | null>(null);
  const [connectConfirmOpen, setConnectConfirmOpen] = useState(false);
  const [milestoneDialogOpen, setMilestoneDialogOpen] = useState(false);
  const [agreeTerms, setAgreeTerms] = useState(false);
  const activeKeysCount = apiKeys?.filter(k => !k.revoked).length || 0;
  const connectedGmailsCount = gmailAccounts?.filter(g => g.connected).length || 0;
  const emailLogs = Array.isArray(logsData?.data) ? logsData.data : [];
  const totalEmailsSent = logsData?.meta?.total ?? 0;
  const volume = analytics?.volume ?? [];
  const caps = analytics?.caps ?? [];
  const maxVal = Math.max(...volume.map(d => d.sent + d.failed), 1);
  const weekSent = volume.reduce((sum, d) => sum + d.sent, 0);
  const weekFailed = volume.reduce((sum, d) => sum + d.failed, 0);
  const weekTotal = weekSent + weekFailed;
  const successRate = weekTotal === 0 ? 100 : Math.round((weekSent / weekTotal) * 100);

  useEffect(() => {
    if (!isLoadingAccounts && connectedGmailsCount > 0 && activeKeysCount === 0) {
      const seen = localStorage.getItem("sendlib_confetti_step1_seen");
      if (!seen) {
        confetti({
          particleCount: 300,
          spread: 120,
          origin: { y: 0.6 }
        });
        const timer = setTimeout(() => setMilestoneDialogOpen(true), 0);
        localStorage.setItem("sendlib_confetti_step1_seen", "true");
        return () => clearTimeout(timer);
      }
    }
  }, [isLoadingAccounts, connectedGmailsCount, activeKeysCount]);

  return (
    <div className="space-y-6">
      {/* Welcome & Actions */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <motion.div 
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          className="space-y-1"
        >
          <h1 className="text-3xl font-headline-md font-bold tracking-tight text-primary-sendlib">Overview</h1>
          <p className="text-secondary font-body-md mt-1">Your API relay service is active and running.</p>
        </motion.div>
        
        <motion.div 
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          className="flex items-center gap-3 w-full sm:w-auto"
        >
          <Button 
            size="lg"
            className="flex-1 sm:flex-initial rounded-lg font-label-sm border-0 bg-emerald-500 hover:bg-emerald-600 text-black font-bold shadow-none transition-all active:scale-95 group cursor-pointer" 
            onClick={() => {
              setConnectConfirmOpen(true);
            }}
            disabled={isConnecting}
          >
            <HugeiconsIcon icon={MailIcon} size={16} color='currentColor' strokeWidth={1.5} className="group-hover:rotate-12 transition-transform" />
            <span className="ml-2">{isConnecting ? "Connecting..." : "Connect Account"}</span>
          </Button>
          <Link href="/dashboard/keys?generate=true" className="flex-1 sm:flex-initial">
            <Button 
              size="lg"
              className="w-full rounded-lg font-label-sm bg-surface-container-low border border-outline-variant/60 hover:bg-surface-container text-white shadow-none transition-all active:scale-95 cursor-pointer"
            >
              <HugeiconsIcon icon={Key01Icon} size={16} color='currentColor' strokeWidth={1.5} />
              <span className="ml-2">Generate Key</span>
            </Button>
          </Link>
        </motion.div>
      </div>

      {/* Compact metrics */}
      <div className="grid grid-cols-2 xl:grid-cols-4 gap-3">
        {[
          { label: "Emails sent", value: isLoadingLogs ? null : totalEmailsSent.toLocaleString(), hint: "All time" },
          { label: "Gmail accounts", value: isLoadingAccounts ? null : String(connectedGmailsCount), hint: connectedGmailsCount === 1 ? redactEmail(gmailAccounts?.find(g => g.connected)?.email) : "Connected relays" },
          { label: "Last 7 days", value: isLoadingAnalytics ? null : weekSent.toLocaleString(), hint: `${weekFailed} failed` },
          { label: "Delivery", value: isLoadingAnalytics ? null : `${successRate}%`, hint: weekTotal === 0 ? "No traffic yet" : "Sent vs failed" },
        ].map((stat) => (
          <div key={stat.label} className="rounded-xl border border-outline-variant bg-surface px-4 py-3.5">
            <p className="text-[11px] font-semibold uppercase tracking-wider text-secondary">{stat.label}</p>
            {stat.value === null ? (
              <Skeleton className="h-7 w-16 mt-1.5 bg-outline-variant/20" />
            ) : (
              <p className="text-2xl font-headline-md font-bold tracking-tight text-on-background mt-1 tabular-nums">{stat.value}</p>
            )}
            <p className="text-[11px] text-secondary mt-1 truncate">{stat.hint}</p>
          </div>
        ))}
      </div>

      {/* Volume + caps */}
      <div className="grid grid-cols-1 lg:grid-cols-5 gap-4 items-stretch">
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="lg:col-span-3"
        >
          <Card className="h-full border border-outline-variant bg-surface shadow-none rounded-xl">
            <CardHeader className="flex flex-row items-start justify-between gap-3 pb-2 px-5 pt-4">
              <div>
                <CardTitle className="text-sm font-headline-md font-bold text-primary-sendlib">Send Volume</CardTitle>
                <p className="text-[11px] text-secondary mt-0.5">Last 7 days</p>
              </div>
              <div className="flex items-center gap-3 text-[11px] font-semibold text-secondary">
                <span className="inline-flex items-center gap-1.5"><span className="w-2 h-2 rounded-sm bg-emerald-500" />Sent</span>
                <span className="inline-flex items-center gap-1.5"><span className="w-2 h-2 rounded-sm bg-sky-400" />Failed</span>
              </div>
            </CardHeader>
            <CardContent className="px-5 pb-4 pt-1">
              {isLoadingAnalytics ? (
                <Skeleton className="h-[148px] w-full rounded-lg bg-outline-variant/10" />
              ) : (
                <div className="flex gap-3">
                  <div className="flex flex-col justify-between h-[120px] text-[10px] font-mono text-secondary/70 py-0.5 tabular-nums">
                    <span>{maxVal}</span>
                    <span>{Math.round(maxVal / 2)}</span>
                    <span>0</span>
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="relative h-[120px] border-b border-outline-variant/40">
                      <div className="absolute inset-x-0 top-0 border-t border-dashed border-outline-variant/25" />
                      <div className="absolute inset-x-0 top-1/2 border-t border-dashed border-outline-variant/25" />
                      <div className="absolute inset-0 flex items-end gap-1.5 sm:gap-2.5 px-1">
                        {volume.map((day) => {
                          const total = day.sent + day.failed;
                          const colH = total === 0 ? 0 : Math.max(4, (total / maxVal) * 120);
                          const sentH = total === 0 ? 0 : (day.sent / total) * colH;
                          const failH = total === 0 ? 0 : colH - sentH;
                          return (
                            <div key={day.date} className="group relative flex-1 h-full flex items-end justify-center">
                              <div className="w-full max-w-[22px] h-full rounded-sm bg-outline-variant/10 overflow-hidden flex flex-col justify-end">
                                {failH > 0 && <div className="w-full bg-sky-400" style={{ height: failH }} />}
                                {sentH > 0 && <div className="w-full bg-emerald-500" style={{ height: sentH }} />}
                              </div>
                              <div className="pointer-events-none absolute -top-1 left-1/2 -translate-x-1/2 -translate-y-full opacity-0 group-hover:opacity-100 transition-opacity z-10">
                                <div className="whitespace-nowrap rounded-md border border-outline-variant bg-surface-container-lowest px-2 py-1 text-[10px] font-mono text-on-background shadow-lg">
                                  {day.sent} sent · {day.failed} failed
                                </div>
                              </div>
                            </div>
                          );
                        })}
                      </div>
                    </div>
                    <div className="flex gap-1.5 sm:gap-2.5 px-1 mt-1.5">
                      {volume.map((day) => (
                        <div key={day.date} className="flex-1 text-center text-[10px] font-mono text-secondary truncate">
                          {day.label}
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              )}
            </CardContent>
          </Card>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.15 }}
          className="lg:col-span-2"
        >
          <Card className="h-full border border-outline-variant bg-surface shadow-none rounded-xl overflow-hidden">
            <CardHeader className="pb-2 px-5 pt-4">
              <CardTitle className="text-sm font-headline-md font-bold text-primary-sendlib">Daily Cap</CardTitle>
              <p className="text-[11px] text-secondary mt-0.5">Per connected Gmail, resets UTC midnight</p>
            </CardHeader>
            <CardContent className="px-5 pb-4 pt-1">
              {isLoadingAnalytics ? (
                <div className="space-y-3">
                  <Skeleton className="h-10 w-full bg-outline-variant/10" />
                  <Skeleton className="h-10 w-full bg-outline-variant/10" />
                </div>
              ) : caps.length === 0 ? (
                <p className="text-xs text-secondary py-6 text-center">No Gmail accounts connected.</p>
              ) : (
                <div className="space-y-3">
                  {caps.map((account) => {
                    const pct = Math.min((account.sentCount / account.limit) * 100, 100);
                    const isHigh = pct >= 80;
                    return (
                      <div key={account.email} className="space-y-1.5">
                        <div className="flex items-center justify-between gap-2">
                          <span className="text-xs font-semibold text-primary-sendlib truncate" title={account.email}>
                            {redactEmail(account.email)}
                          </span>
                          <span className="text-[10px] font-mono text-secondary shrink-0">
                            {account.sentCount}/{account.limit}
                          </span>
                        </div>
                        <div className="h-1.5 rounded-full bg-outline-variant/20 overflow-hidden">
                          <div
                            className={`h-full rounded-full ${isHigh ? "bg-rose-500" : "bg-emerald-500"}`}
                            style={{ width: `${Math.max(pct, pct > 0 ? 2 : 0)}%` }}
                          />
                        </div>
                      </div>
                    );
                  })}
                </div>
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
           className={`${totalEmailsSent > 0 ? "lg:col-span-3" : "lg:col-span-2"} flex flex-col`}
        >
          <Card className="h-full flex flex-col border border-outline-variant bg-surface shadow-none rounded-xl overflow-hidden hover:bg-surface-container-low transition-colors">
            <CardHeader className="flex flex-row items-center justify-between pb-4">
              <CardTitle className="text-lg font-headline-md font-bold text-primary-sendlib">Recent Email Logs</CardTitle>
              <div className="flex items-center gap-1">
                <Link href="/dashboard/debugger" className="text-xs font-semibold text-secondary hover:text-primary-sendlib px-2">
                  Debugger
                </Link>
              <Button 
                variant="ghost" 
                size="sm" 
                className="font-semibold h-8 w-8 p-0 text-secondary hover:text-primary-sendlib hover:bg-surface-container-low rounded-lg cursor-pointer"
                onClick={() => refetchLogs()}
              >
                <HugeiconsIcon 
                  icon={Refresh01Icon} 
                  size={16} 
                  color='currentColor' 
                  strokeWidth={1.5} 
                  className={isFetchingLogs ? "animate-spin text-primary-sendlib" : "text-secondary"} 
                />
              </Button>
              </div>
            </CardHeader>
            <CardContent className="p-0 flex-1">
              <Table>
                <TableHeader className="bg-surface border-y border-outline-variant/30">
                  <TableRow className="border-outline-variant/30 hover:bg-transparent">
                    <TableHead className="font-label-sm font-bold pl-6 text-primary-sendlib">From</TableHead>
                    <TableHead className="font-label-sm font-bold text-primary-sendlib">To</TableHead>
                    <TableHead className="font-label-sm font-bold text-primary-sendlib">Subject</TableHead>
                    <TableHead className="font-label-sm font-bold text-primary-sendlib">Status</TableHead>
                    <TableHead className="font-label-sm font-bold text-right pr-6 text-primary-sendlib">Date</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {isLoadingLogs || isFetchingLogs ? (
                    Array.from({ length: 3 }).map((_, i) => (
                      <TableRow key={i} className="border-outline-variant/30">
                        <TableCell className="pl-6 py-4"><Skeleton className="h-5 w-24 bg-outline-variant/20" /></TableCell>
                        <TableCell><Skeleton className="h-5 w-24 bg-outline-variant/20" /></TableCell>
                        <TableCell><Skeleton className="h-5 w-32 bg-outline-variant/20" /></TableCell>
                        <TableCell><Skeleton className="h-5 w-16 bg-outline-variant/20" /></TableCell>
                        <TableCell className="pr-6"><Skeleton className="h-4 w-20 ml-auto bg-outline-variant/20" /></TableCell>
                      </TableRow>
                    ))
                  ) : emailLogs.length === 0 ? (
                    <TableRow>
                      <TableCell colSpan={5} className="text-center py-10">
                        <div className="flex flex-col items-center justify-center max-w-[380px] mx-auto space-y-2.5">
                          <HugeiconsIcon icon={FileTypeIcon} size={40} color='currentColor' strokeWidth={1.5} className="text-primary-sendlib opacity-40 mb-0.5" />
                          <h4 className="text-base font-headline-md font-bold text-primary-sendlib">No email logs found</h4>
                          <p className="text-xs text-secondary leading-relaxed">
                            Sent emails will appear here automatically once you send through the Sendlib API.
                          </p>
                          <div className="pt-1 flex items-center gap-2.5">
                            <Link href="/docs/send">
                               <Button variant="outline" size="sm" className="rounded-lg font-label-sm border border-outline-variant bg-surface text-primary-sendlib shadow-xs hover:bg-surface-container-low px-3.5 h-8">
                                 View API Docs
                               </Button>
                            </Link>
                            <Link href="/dashboard/templates">
                               <Button size="sm" className="rounded-lg font-label-sm bg-surface-container-low border border-outline-variant/60 hover:bg-surface-container text-white shadow-sm px-3.5 h-8">
                                 Templates
                               </Button>
                            </Link>
                          </div>
                        </div>
                      </TableCell>
                    </TableRow>
                  ) : (
                    emailLogs.map((log: EmailLog, index: number) => (
                      <TableRow key={log.id || index} className="border-outline-variant/30 transition-colors hover:bg-surface-container-low group">
                        <TableCell className="pl-6 py-4 font-mono text-xs text-secondary whitespace-nowrap">
                          {log.from ? redactEmail(log.from) : "—"}
                        </TableCell>
                        <TableCell className="py-4 font-bold text-sm text-primary-sendlib whitespace-nowrap">
                          {redactEmail(log.to)}
                        </TableCell>
                        <TableCell className="py-4 text-xs text-secondary truncate max-w-[150px]" title={log.subject}>
                          {log.subject}
                        </TableCell>
                        <TableCell>
                          <Badge 
                            variant={log.status === "sent" ? "outline" : "secondary"} 
                            className={`
                              font-semibold rounded-md tracking-wider text-[10px] border-border
                              ${log.status === "failed" ? "bg-destructive/10 text-destructive border-transparent" : "bg-emerald-500/10 text-emerald-400 border-emerald-500/20"}
                            `}
                          >
                            {log.status === "sent" && <HugeiconsIcon icon={CheckmarkCircle01Icon} size={12} color='currentColor' strokeWidth={1.5} className="mr-1" />}
                            {log.status === "failed" && <HugeiconsIcon icon={CancelCircleIcon} size={12} color='currentColor' strokeWidth={1.5} className="mr-1" />}
                            {log.status}
                          </Badge>
                        </TableCell>
                        <TableCell className="text-sm text-secondary font-medium text-right pr-6">
                          {new Date(log.createdAt).toLocaleDateString()} {new Date(log.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
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
        {totalEmailsSent === 0 && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5 }}
            className="flex flex-col"
          >
            <Card className="h-full flex flex-col border border-outline-variant bg-surface shadow-none rounded-xl hover:bg-surface-container-low transition-colors">
              <CardHeader className="pb-3">
                <CardTitle className="text-xs font-label-xs uppercase tracking-wider text-secondary">Setup Guide</CardTitle>
              </CardHeader>
              <CardContent className="flex-1 flex flex-col justify-center pb-6 px-6 space-y-0 gap-1">
                {/* Step 1 */}
                <div className="flex gap-4 items-start">
                  <div className="flex flex-col items-center shrink-0">
                    <div className={`w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold transition-colors duration-300 z-10 ${
                      connectedGmailsCount > 0 ? "bg-primary-sendlib text-surface-container-lowest" : "border border-outline-variant bg-surface text-primary-sendlib"
                    }`}>
                      1
                    </div>
                    <div className={`w-0.5 h-10 my-1 transition-colors duration-300 ${connectedGmailsCount > 0 ? "bg-primary-sendlib" : "bg-outline-variant/30"}`} />
                  </div>
                  <div className="pt-0.5">
                    <h4 className={`font-bold text-sm transition-colors duration-300 ${connectedGmailsCount > 0 ? "text-primary-sendlib" : "text-secondary"}`}>Connect Gmail</h4>
                    <p className="text-xs text-secondary mt-0.5 leading-snug">Authorize your Google account for sending.</p>
                  </div>
                </div>

                {/* Step 2 */}
                <div className="flex gap-4 items-start">
                  <div className="flex flex-col items-center shrink-0">
                    <div className={`w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold transition-colors duration-300 z-10 ${
                      activeKeysCount > 0 ? "bg-primary-sendlib text-surface-container-lowest" : "border border-outline-variant bg-surface text-primary-sendlib"
                    }`}>
                      2
                    </div>
                    <div className={`w-0.5 h-10 my-1 transition-colors duration-300 ${activeKeysCount > 0 ? "bg-primary-sendlib" : "bg-outline-variant/30"}`} />
                  </div>
                  <div className="pt-0.5">
                    <h4 className={`font-bold text-sm transition-colors duration-300 ${activeKeysCount > 0 ? "text-primary-sendlib" : "text-secondary"}`}>Get API Key</h4>
                    <p className="text-xs text-secondary mt-0.5 leading-snug">Generate a secret key to authenticate your requests.</p>
                  </div>
                </div>

                {/* Step 3 */}
                <div className="flex gap-4 items-start">
                  <div className="flex flex-col items-center shrink-0">
                    <div className={`w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold transition-colors duration-300 z-10 ${
                      totalEmailsSent > 0 ? "bg-primary-sendlib text-surface-container-lowest" : "border border-outline-variant bg-surface text-primary-sendlib"
                    }`}>
                      3
                    </div>
                  </div>
                  <div className="pt-0.5">
                    <h4 className={`font-bold text-sm transition-colors duration-300 ${totalEmailsSent > 0 ? "text-primary-sendlib" : "text-secondary"}`}>Send transactional emails</h4>
                    <p className="text-xs text-secondary mt-0.5 leading-snug">Use our REST API to send transactional emails seamlessly.</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        )}
      </div>

      {/* Generated Key Slide-over Drawer */}
      <Sheet open={!!newKeyDialog} onOpenChange={() => setNewKeyDialog(null)}>
        <SheetContent side="right" className="w-full sm:max-w-md border-l border-outline-variant p-6 bg-surface-container-lowest">
          <SheetHeader className="p-0 mb-6">
            <SheetTitle className="text-xl font-headline-md font-bold text-primary-sendlib">API Key Generated</SheetTitle>
            <SheetDescription className="text-secondary text-sm">
              Copy your new secret key below. For security reasons, you won&apos;t be able to view it again.
            </SheetDescription>
          </SheetHeader>
          <div className="space-y-5">
            <div>
              <label className="text-sm font-label-sm font-semibold text-on-background mb-2 block">Your API Key</label>
              <div className="font-mono bg-surface-container-low p-3.5 rounded-lg text-sm break-all border border-outline-variant text-primary-sendlib selection:bg-primary-sendlib selection:text-on-primary">
                {newKeyDialog?.key}
              </div>
            </div>
          </div>
          <SheetFooter className="p-0 mt-6 pt-4 border-t border-outline-variant">
            <Button 
              className="w-full rounded-lg font-label-sm bg-surface-container-low border border-outline-variant/60 hover:bg-surface-container text-white py-2.5" 
              onClick={async () => {
                try {
                  await navigator.clipboard.writeText(newKeyDialog?.key || "");
                  toast.success("API Key copied to clipboard!");
                } catch (err) {
                  toast.error("Failed to copy API key");
                }
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
            <DialogTitle className="text-xl font-headline-md font-bold text-primary-sendlib">Connect Gmail Account</DialogTitle>
            <DialogDescription className="text-secondary text-sm leading-relaxed mt-1">
              Connect your Google account via secure OAuth 2.0. Sendlib will only request the narrow permissions required to relay transactional emails on your behalf, and your credentials are never seen or stored.
            </DialogDescription>
          </DialogHeader>
          <label className="flex items-start gap-3 mt-3 p-3.5 rounded-xl bg-surface-container-low border border-outline-variant/80 hover:border-primary-sendlib/40 transition-colors text-xs text-secondary cursor-pointer select-none">
            <input 
              type="checkbox" 
              checked={agreeTerms} 
              onChange={(e) => setAgreeTerms(e.target.checked)} 
              className="mt-0.5 h-4 w-4 rounded border-outline-variant text-primary-sendlib accent-primary-sendlib focus:ring-primary-sendlib shrink-0 cursor-pointer" 
            />
            <span className="leading-relaxed">
              I agree to use this account for <strong>transactional emails only</strong> (welcome emails, password resets, OTPs, receipts, etc.) and acknowledge that bulk cold spam will result in immediate account suspension.
            </span>
          </label>
          <div className="flex flex-row gap-3 mt-4 pt-4 border-t border-outline-variant/60">
            <Button 
              variant="outline" 
              className="flex-1 rounded-lg font-label-sm border border-outline-variant hover:bg-surface-container-low cursor-pointer" 
              onClick={() => setConnectConfirmOpen(false)}
            >
              Cancel
            </Button>
            <Button 
              className="flex-1 rounded-lg font-label-sm bg-emerald-500 hover:bg-emerald-600 text-black font-bold border-0 cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed" 
              onClick={() => {
                if (!agreeTerms) {
                  toast.error("Please agree to the transactional usage terms first.");
                  return;
                }
                setConnectConfirmOpen(false);
                toast.loading("Redirecting to Google...", { id: "gmail-connect" });
                connectGmail();
              }}
              disabled={isConnecting || !agreeTerms}
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
            <DialogTitle className="text-xl font-headline-md font-bold text-primary-sendlib flex items-center gap-2">
              <span>🎉</span> Step 1 Complete!
            </DialogTitle>
            <DialogDescription className="text-secondary text-sm leading-relaxed mt-1">
              You&apos;ve successfully connected your Gmail account! Next up: Generate an API Key to authorize email requests from your app.
            </DialogDescription>
          </DialogHeader>
          <div className="flex flex-row gap-3 mt-4 pt-4 border-t border-outline-variant/30">
            <Button 
              variant="outline" 
              className="flex-1 rounded-lg font-label-sm border border-outline-variant hover:bg-surface-container-low cursor-pointer" 
              onClick={() => setMilestoneDialogOpen(false)}
            >
              Dismiss
            </Button>
            <Link href="/dashboard/keys" className="flex-1">
              <Button 
                className="w-full rounded-lg font-label-sm bg-surface-container-low border border-outline-variant/60 hover:bg-surface-container text-white cursor-pointer" 
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
