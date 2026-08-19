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
  const maxVal = Math.max(...volume.map(d => d.sent + d.failed), 10);

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
            className="flex-1 sm:flex-initial rounded-lg font-label-sm bg-surface-container-low border border-outline-variant/60 hover:bg-surface-container text-white shadow-sm transition-all active:scale-95 group cursor-pointer" 
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
              variant="outline" 
              className="w-full rounded-lg font-label-sm border border-outline-variant bg-surface text-primary-sendlib shadow-xs hover:bg-surface-container-low transition-all active:scale-95 cursor-pointer"
            >
              <HugeiconsIcon icon={Key01Icon} size={16} color='currentColor' strokeWidth={1.5} />
              <span className="ml-2">Generate Key</span>
            </Button>
          </Link>
        </motion.div>
      </div>

      {/* Main Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="md:col-span-1"
        >
          <Card className="h-full border-0 ring-0 bg-surface shadow-none hover:bg-surface-container-low transition-all rounded-xl relative overflow-hidden">
            <CardContent className="p-6 h-full flex items-center justify-between">
              {isLoadingLogs ? (
                <div className="space-y-3 w-full">
                  <Skeleton className="h-5 w-24 bg-outline-variant/20" />
                  <Skeleton className="h-10 w-24 bg-outline-variant/20" />
                  <Skeleton className="h-3 w-32 bg-outline-variant/20" />
                </div>
              ) : (
                <>
                  <div className="flex flex-col h-full justify-between z-10 space-y-4">
                    <div className="flex items-center gap-3">
                      <div className="w-11 h-11 rounded-xl bg-surface-container-low border border-outline-variant/60 flex items-center justify-center text-primary-sendlib shadow-inner">
                        <HugeiconsIcon icon={FileTypeIcon} size={22} color='currentColor' strokeWidth={1.5} />
                      </div>
                      <div className="flex flex-col">
                        <span className="text-sm font-label-sm font-bold text-on-background">Emails Sent</span>
                        <span className="text-xs text-secondary mt-0.5">Total outbound</span>
                      </div>
                    </div>
                    <div className="text-4xl font-headline-md font-bold tracking-tight text-on-background">
                      {totalEmailsSent.toLocaleString()}
                    </div>
                    <div className="text-xs text-secondary font-medium flex items-center gap-1.5">
                      <span className="flex items-center gap-1 px-1.5 py-0.5 bg-emerald-500/10 text-emerald-400 rounded-md">
                        <HugeiconsIcon icon={CheckmarkCircle01Icon} size={12} color='currentColor' strokeWidth={1.5} /> Active
                      </span> 
                      <span className="opacity-70">this week</span>
                    </div>
                  </div>
                  
                  {/* Right side sparkline */}
                  <div className="w-[120px] h-[70px] opacity-100 z-0 hidden sm:block relative">
                    <svg viewBox="0 0 120 70" className="w-full h-full overflow-visible">
                      <defs>
                        <linearGradient id="sparkline-gradient-1" x1="0" y1="0" x2="0" y2="1">
                          <stop offset="0%" stopColor="#10b981" stopOpacity="0.25" />
                          <stop offset="100%" stopColor="#10b981" stopOpacity="0" />
                        </linearGradient>
                      </defs>
                      {/* Area */}
                      <path d="M0,50 C20,50 30,35 50,40 C70,45 80,25 100,30 C110,32 115,20 120,20 L120,70 L0,70 Z" fill="url(#sparkline-gradient-1)" />
                      {/* Line */}
                      <path d="M0,50 C20,50 30,35 50,40 C70,45 80,25 100,30 C110,32 115,20 120,20" fill="none" stroke="#10b981" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" />
                      {/* Point */}
                      <circle cx="120" cy="20" r="3.5" fill="#020403" stroke="#10b981" strokeWidth="2.5" />
                    </svg>
                  </div>
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
          <Card className="h-full border-0 ring-0 bg-surface shadow-none hover:bg-surface-container-low transition-all rounded-xl relative overflow-hidden">
            <CardContent className="p-6 h-full flex items-center justify-between">
              {isLoadingAccounts ? (
                <div className="space-y-3 w-full">
                  <Skeleton className="h-5 w-32 bg-outline-variant/20" />
                  <Skeleton className="h-10 w-12 bg-outline-variant/20" />
                  <Skeleton className="h-3 w-full bg-outline-variant/20" />
                </div>
              ) : (
                <>
                  <div className="flex flex-col h-full justify-between z-10 space-y-4">
                    <div className="flex items-center gap-3">
                      <div className="w-11 h-11 rounded-xl bg-surface-container-low border border-outline-variant/60 flex items-center justify-center text-primary-sendlib shadow-inner">
                        <HugeiconsIcon icon={MailIcon} size={22} color='currentColor' strokeWidth={1.5} />
                      </div>
                      <div className="flex flex-col">
                        <span className="text-sm font-label-sm font-bold text-on-background">Connected Gmails</span>
                        <span className="text-xs text-secondary mt-0.5">Active relays</span>
                      </div>
                    </div>
                    <div className="text-4xl font-headline-md font-bold tracking-tight text-on-background">
                      {connectedGmailsCount}
                    </div>
                    <div className="text-xs text-secondary font-medium flex items-center gap-1.5">
                      <span className="flex items-center gap-1 px-1.5 py-0.5 bg-emerald-500/10 text-emerald-400 rounded-md">
                        <HugeiconsIcon icon={CheckmarkCircle01Icon} size={12} color='currentColor' strokeWidth={1.5} /> Active
                      </span> 
                      <span className="opacity-70 truncate max-w-[120px]">
                        {connectedGmailsCount === 0 
                          ? "None connected" 
                          : connectedGmailsCount === 1 
                            ? redactEmail(gmailAccounts?.find(g => g.connected)?.email) 
                            : `${connectedGmailsCount} accounts`}
                      </span>
                    </div>
                  </div>

                  {/* Right side sparkline */}
                  <div className="w-[120px] h-[70px] opacity-100 z-0 hidden sm:block relative">
                    <svg viewBox="0 0 120 70" className="w-full h-full overflow-visible">
                      <defs>
                        <linearGradient id="sparkline-gradient-2" x1="0" y1="0" x2="0" y2="1">
                          <stop offset="0%" stopColor="#10b981" stopOpacity="0.25" />
                          <stop offset="100%" stopColor="#10b981" stopOpacity="0" />
                        </linearGradient>
                      </defs>
                      <path d="M0,60 C30,60 40,40 60,45 C80,50 90,30 120,25 L120,70 L0,70 Z" fill="url(#sparkline-gradient-2)" />
                      <path d="M0,60 C30,60 40,40 60,45 C80,50 90,30 120,25" fill="none" stroke="#10b981" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" />
                      <circle cx="120" cy="25" r="3.5" fill="#020403" stroke="#10b981" strokeWidth="2.5" />
                    </svg>
                  </div>
                </>
              )}
            </CardContent>
          </Card>
        </motion.div>
      </div>

      {/* Analytics Section */}
      <div className="grid grid-cols-1 gap-6 items-stretch">
        {/* Sending Volume Bar Chart */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.35 }}
          className="flex flex-col order-2"
        >
          <Card className="h-full flex flex-col border border-outline-variant bg-surface shadow-none rounded-xl overflow-hidden hover:bg-surface-container-low transition-colors">
            <CardHeader className="flex flex-row items-center justify-between pb-3">
              <div>
                <CardTitle className="text-lg font-headline-md font-bold text-primary-sendlib">Send Volume</CardTitle>
                <p className="text-xs text-secondary mt-0.5">Email relay traffic for the last 7 days</p>
              </div>
              <div className="flex items-center gap-4 text-xs font-semibold text-secondary">
                <div className="flex items-center gap-1.5">
                  <span className="w-2.5 h-2.5 rounded bg-indigo-500"></span>
                  <span>Sent</span>
                </div>
                <div className="flex items-center gap-1.5">
                  <span className="w-2.5 h-2.5 rounded bg-rose-500"></span>
                  <span>Failed</span>
                </div>
              </div>
            </CardHeader>
            <CardContent className="flex-1 p-6 pt-2 flex flex-col justify-between">
              {isLoadingAnalytics ? (
                <div className="h-[220px] flex items-center justify-center">
                  <Skeleton className="w-full h-full rounded-lg bg-outline-variant/10" />
                </div>
              ) : (
                <div className="w-full relative">
                  <svg viewBox="0 0 600 220" className="w-full h-auto overflow-visible">
                    {/* Horizontal Grid Lines */}
                    <line x1="50" y1="40" x2="560" y2="40" stroke="currentColor" strokeWidth="1" strokeDasharray="3 3" opacity="0.1" className="text-outline-variant" />
                    <line x1="50" y1="110" x2="560" y2="110" stroke="currentColor" strokeWidth="1" strokeDasharray="3 3" opacity="0.1" className="text-outline-variant" />
                    <line x1="50" y1="180" x2="560" y2="180" stroke="currentColor" strokeWidth="1.5" opacity="0.15" className="text-outline-variant" />

                    {/* Y-Axis Value Labels */}
                    <text x="35" y="44" className="text-[10px] font-bold font-mono fill-secondary/65 text-right">{maxVal}</text>
                    <text x="35" y="114" className="text-[10px] font-bold font-mono fill-secondary/65 text-right">{Math.round(maxVal / 2)}</text>
                    <text x="35" y="184" className="text-[10px] font-bold font-mono fill-secondary/65 text-right">0</text>

                    {/* Render Columns */}
                    {volume.map((day, idx) => {
                      const colWidth = 510 / 7;
                      const colCenter = 60 + idx * colWidth + colWidth / 2;
                      
                      // Scale factor (140px max height)
                      const scale = 140 / maxVal;
                      const sentHeight = day.sent * scale;
                      const failedHeight = day.failed * scale;
                      
                      // Positions
                      const sentY = 180 - sentHeight;
                      const failedY = sentY - failedHeight;
                      const barWidth = 24;

                      return (
                        <g key={day.date} className="group/bar cursor-pointer">
                          {/* Background Hover Highlight Column */}
                          <rect
                            x={colCenter - colWidth / 2}
                            y="20"
                            width={colWidth}
                            height="170"
                            fill="currentColor"
                            opacity="0"
                            className="text-white hover:opacity-[0.05] transition-opacity duration-200"
                            rx="8"
                          />

                          {/* Sent Bar (Indigo) */}
                          {day.sent > 0 && (
                            <rect
                              x={colCenter - barWidth / 2}
                              y={sentY}
                              width={barWidth}
                              height={sentHeight}
                              fill="#4f46e5"
                              rx={day.failed > 0 ? 0 : 4}
                            />
                          )}

                          {/* Failed Bar (Rose) */}
                          {day.failed > 0 && (
                            <rect
                              x={colCenter - barWidth / 2}
                              y={failedY}
                              width={barWidth}
                              height={failedHeight}
                              fill="#ef4444"
                              rx="4"
                            />
                          )}

                          {/* Date Label */}
                          <text
                            x={colCenter}
                            y="198"
                            textAnchor="middle"
                            className="text-[10px] font-bold font-mono fill-secondary"
                          >
                            {day.label}
                          </text>

                          {/* Value Tooltip Hover Box (Custom SVG overlay) */}
                          <g className="opacity-0 group-hover/bar:opacity-100 transition-opacity duration-200 pointer-events-none">
                            <rect
                              x={colCenter - 45}
                              y={Math.min(failedY - 45, 120)}
                              width="90"
                              height="35"
                              fill="#1a1a1a"
                              rx="6"
                              className="stroke-outline-variant stroke-1"
                            />
                            <text
                              x={colCenter}
                              y={Math.min(failedY - 28, 137)}
                              textAnchor="middle"
                              className="text-[9px] font-bold fill-white font-mono"
                            >
                              Sent: {day.sent} | Fail: {day.failed}
                            </text>
                          </g>
                        </g>
                      );
                    })}
                  </svg>
                </div>
              )}
            </CardContent>
          </Card>
        </motion.div>

        {/* Daily Cap Progress meters */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="flex flex-col order-1"
        >
          <Card className="h-full flex flex-col border border-outline-variant bg-surface shadow-none rounded-xl overflow-hidden hover:bg-surface-container-low transition-colors">
            <CardHeader className="pb-3">
              <CardTitle className="text-lg font-headline-md font-bold text-primary-sendlib">Daily Cap Usage</CardTitle>
              <p className="text-xs text-secondary mt-0.5">Google daily relay limits per connected account</p>
            </CardHeader>
            <CardContent className="flex-1 p-6 pt-2 flex flex-col justify-center space-y-4">
              {isLoadingAnalytics ? (
                <div className="space-y-4">
                  <Skeleton className="h-12 w-full rounded-lg bg-outline-variant/10" />
                  <Skeleton className="h-12 w-full rounded-lg bg-outline-variant/10" />
                </div>
              ) : caps.length === 0 ? (
                <div className="text-center py-6 text-sm text-secondary italic">
                  No Gmail accounts connected.
                </div>
              ) : (
                caps.map((account) => {
                  const pct = Math.min((account.sentCount / account.limit) * 100, 100);
                  const isHigh = pct >= 80;
                  return (
                    <div key={account.email} className="space-y-2">
                      <div className="flex justify-between items-center text-xs">
                        <span className="font-bold text-primary-sendlib">{redactEmail(account.email)}</span>
                        <span className="font-bold font-mono text-secondary">
                          {account.sentCount} / {account.limit}
                        </span>
                      </div>
                      
                      {/* Progress Bar */}
                      <div className="w-full h-2.5 rounded-full bg-outline-variant/30 overflow-hidden">
                        <div
                          className={`h-full rounded-full transition-all duration-500 ${
                            isHigh ? "bg-rose-500" : "bg-primary-sendlib"
                          }`}
                          style={{ width: `${pct}%` }}
                        />
                      </div>
                      
                      <div className="flex justify-between items-center text-[10px] text-secondary font-medium">
                        <span>Resetting daily</span>
                        <span className="font-bold uppercase tracking-wider text-[9px]">
                          {account.limit === 2000 ? "Workspace" : "Gmail Personal"}
                        </span>
                      </div>
                    </div>
                  );
                })
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
                            <Link href="/dashboard/keys?generate=true">
                               <Button size="sm" className="rounded-lg font-label-sm bg-surface-container-low border border-outline-variant/60 hover:bg-surface-container text-white shadow-sm px-3.5 h-8">
                                 Get API Key
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
              className="flex-1 rounded-lg font-label-sm bg-surface-container-low border border-outline-variant/60 hover:bg-surface-container text-white cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed" 
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
