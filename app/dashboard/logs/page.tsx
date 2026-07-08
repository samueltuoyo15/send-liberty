"use client";

import { useState } from "react";
import Link from "next/link";
import { HugeiconsIcon } from '@hugeicons/react';
import { FileTypeIcon, Search01Icon, CheckmarkCircle01Icon, CancelCircleIcon } from '@hugeicons/core-free-icons';
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { useEmailLogs } from "@/hooks/useEmailLogs";

export default function LogsPage() {
  const [page, setPage] = useState(1);
  const { data: logsData, isLoading } = useEmailLogs(page, 20);
  
  const logs = Array.isArray(logsData?.data) ? logsData.data : [];
  const meta = logsData?.meta ?? { total: 0, page, limit: 20, totalPages: 1 };
  const hasNextPage = logs.length === (meta.limit ?? 20);
  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-3xl font-headline-md font-bold tracking-tight text-primary-sendliberty">Email Logs</h1>
          <p className="text-secondary font-body-md mt-1">
            View the recent history of all emails sent via your API keys.
          </p>
        </div>
        <div className="flex items-center gap-2 bg-surface-container-low border border-outline-variant rounded-lg px-3 h-10 shadow-xs focus-within:border-primary-sendliberty focus-within:bg-white transition-colors w-full sm:w-auto">
          <HugeiconsIcon icon={Search01Icon} size={16} color='currentColor' strokeWidth={1.5} className="text-secondary" />
          <input 
            className="bg-transparent border-none outline-none text-sm px-2 placeholder:text-secondary w-full sm:w-64 font-mono" 
            placeholder="Search by recipient or subject..." 
          />
        </div>
      </div>

      <div className="rounded-xl border border-outline-variant bg-surface-container-lowest overflow-hidden shadow-none">
        <table className="w-full text-sm text-left">
          <thead className="bg-surface-container-low border-b border-outline-variant text-secondary font-label-sm">
            <tr>
              <th className="px-6 py-4">To / Subject</th>
              <th className="px-6 py-4">Status</th>
              <th className="px-6 py-4 text-right">Date</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-border">
            {isLoading ? (
              Array.from({ length: 5 }).map((_, i) => (
                <tr key={i}>
                  <td className="px-6 py-4"><Skeleton className="h-8 w-full max-w-[200px]" /></td>
                  <td className="px-6 py-4"><Skeleton className="h-5 w-20" /></td>
                  <td className="px-6 py-4"><Skeleton className="h-4 w-24 ml-auto" /></td>
                </tr>
              ))
            ) : logs.length === 0 ? (
              <tr>
                <td colSpan={3} className="px-6 py-16 text-center">
                  <div className="flex flex-col items-center justify-center max-w-[420px] mx-auto space-y-3">
                    <HugeiconsIcon icon={FileTypeIcon} size={48} color='currentColor' strokeWidth={1.5} className="text-primary-sendliberty opacity-50 mb-1" />
                    <h3 className="text-lg font-headline-md font-bold text-on-background">No email logs found</h3>
                    <p className="text-sm text-secondary leading-relaxed">
                      You haven't sent any emails yet. Send an email using our REST API or Quickstart guide to view logs here.
                    </p>
                    <div className="pt-2 flex flex-col sm:flex-row items-center gap-3">
                      <Link href="/docs/send">
                        <Button variant="outline" className="rounded-lg font-label-sm border border-outline-variant bg-surface-container-lowest text-primary-sendliberty shadow-xs hover:bg-surface-container-low px-4">
                          View API Docs
                        </Button>
                      </Link>
                      <Link href="/dashboard/keys?generate=true">
                        <Button className="rounded-lg font-label-sm bg-primary-sendliberty hover:bg-primary-sendliberty/90 text-white shadow-sm px-4">
                          Get API Key
                        </Button>
                      </Link>
                    </div>
                  </div>
                </td>
              </tr>
            ) : (
              logs.map((log: any) => (
                <tr key={log.id} className="hover:bg-muted/30 transition-colors">
                  <td className="px-6 py-4">
                    <div className="font-semibold text-foreground">{log.to}</div>
                    <div className="text-muted-foreground text-xs mt-0.5 truncate max-w-[300px]">{log.subject}</div>
                  </td>
                  <td className="px-6 py-4">
                    <Badge 
                      variant={log.status === "sent" ? "outline" : "secondary"} 
                      className={`
                        font-semibold rounded-md tracking-wider text-[10px] border-border
                        ${log.status === "failed" ? "bg-destructive/10 text-destructive border-transparent" : "bg-emerald-50 text-emerald-700 border-emerald-200 dark:bg-emerald-500/10 dark:text-emerald-400 dark:border-emerald-500/20"}
                      `}
                    >
                      {log.status === "sent" && <HugeiconsIcon icon={CheckmarkCircle01Icon} size={12} color='currentColor' strokeWidth={1.5} className="mr-1" />}
                      {log.status === "failed" && <HugeiconsIcon icon={CancelCircleIcon} size={12} color='currentColor' strokeWidth={1.5} className="mr-1" />}
                      {log.status}
                    </Badge>
                  </td>
                  <td className="px-6 py-4 text-right text-muted-foreground whitespace-nowrap">
                    {new Date(log.created_at).toLocaleDateString()} {new Date(log.created_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
        <div className="p-4 border-t border-border flex justify-between items-center bg-muted/20">
          <span className="text-sm text-muted-foreground">Page {page}</span>
          <div className="flex gap-2">
            <Button 
              variant="outline" 
              size="sm" 
              disabled={page === 1 || isLoading}
              onClick={() => setPage(p => Math.max(1, p - 1))}
            >
              Previous
            </Button>
            <Button 
              variant="outline" 
              size="sm" 
              disabled={!hasNextPage || isLoading}
              onClick={() => setPage(p => p + 1)}
            >
              Next
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
