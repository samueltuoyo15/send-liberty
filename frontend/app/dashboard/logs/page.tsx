"use client";

import { useState } from "react";
import { FileText, Search, CheckCircle2, XCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { useEmailLogs } from "@/hooks/useEmailLogs";

export default function LogsPage() {
  const [page, setPage] = useState(1);
  const { data: logsData, isLoading } = useEmailLogs(page, 20);
  
  const logs = logsData || [];
  const meta = { total: 0, page: 1, limit: 20, totalPages: 1 }; // mocked meta for now
  const hasNextPage = logs.length === 20; // assuming limit is 20
  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Email Logs</h1>
          <p className="text-muted-foreground mt-1">
            View the recent history of all emails sent via your API keys.
          </p>
        </div>
        <div className="flex items-center gap-2 bg-card border border-border rounded-md px-3 h-10 shadow-sm w-full sm:w-auto">
          <Search className="h-4 w-4 text-muted-foreground" />
          <input 
            className="bg-transparent border-none outline-none text-sm px-2 placeholder:text-muted-foreground w-full sm:w-64" 
            placeholder="Search by recipient or subject..." 
          />
        </div>
      </div>

      <div className="rounded-xl border border-border bg-card overflow-hidden shadow-sm">
        <table className="w-full text-sm text-left">
          <thead className="bg-muted/50 border-b border-border text-muted-foreground font-medium">
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
                <td colSpan={3} className="px-6 py-12 text-center text-muted-foreground">
                  No email logs found.
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
                      {log.status === "sent" && <CheckCircle2 className="w-3 h-3 mr-1" />}
                      {log.status === "failed" && <XCircle className="w-3 h-3 mr-1" />}
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
