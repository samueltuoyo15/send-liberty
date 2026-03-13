"use client";

import { useState } from "react";
import { FileText, Search, Clock, Trash2, CheckCircle2, XCircle, AlertCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { useScheduledEmails, useCancelScheduledEmail, ScheduledEmail } from "@/hooks/useScheduledEmails";

export default function ScheduledEmailsPage() {
  const [statusFilter, setStatusFilter] = useState<string | undefined>(undefined);
  const { data: response, isLoading } = useScheduledEmails(statusFilter);
  const { mutate: cancelEmail, isPending: isCancelling } = useCancelScheduledEmail();
  
  const emails: ScheduledEmail[] = response || [];

  return (
    <div className="space-y-6 max-w-[1200px] mx-auto">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Scheduled Emails</h1>
          <p className="text-muted-foreground mt-1">
            Manage emails scheduled for future delivery.
          </p>
        </div>
        <div className="flex items-center gap-2">
          <select 
            className="bg-card border border-border rounded-md px-3 h-10 shadow-sm text-sm"
            value={statusFilter || ""}
            onChange={(e) => setStatusFilter(e.target.value || undefined)}
          >
            <option value="">All Statuses</option>
            <option value="pending">Pending</option>
            <option value="sent">Sent</option>
            <option value="failed">Failed</option>
            <option value="cancelled">Cancelled</option>
          </select>
          <Button className="font-semibold shadow-md">
            <Clock className="w-4 h-4 mr-2" />
            Schedule New
          </Button>
        </div>
      </div>

      <div className="rounded-xl border border-border bg-card overflow-hidden shadow-sm">
        <div className="overflow-x-auto">
          <table className="w-full text-sm text-left whitespace-nowrap">
            <thead className="bg-muted/50 border-b border-border text-muted-foreground font-medium">
              <tr>
                <th className="px-6 py-4">To / Subject</th>
                <th className="px-6 py-4">Status</th>
                <th className="px-6 py-4">Scheduled For</th>
                <th className="px-6 py-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border">
              {isLoading ? (
                Array.from({ length: 4 }).map((_, i) => (
                  <tr key={i}>
                    <td className="px-6 py-4"><Skeleton className="h-8 w-48" /></td>
                    <td className="px-6 py-4"><Skeleton className="h-5 w-20" /></td>
                    <td className="px-6 py-4"><Skeleton className="h-4 w-32" /></td>
                    <td className="px-6 py-4"><Skeleton className="h-8 w-16 ml-auto" /></td>
                  </tr>
                ))
              ) : emails.length === 0 ? (
                <tr>
                  <td colSpan={4} className="px-6 py-12 text-center text-muted-foreground">
                    No scheduled emails found.
                  </td>
                </tr>
              ) : (
                emails.map((email) => (
                  <tr key={email.id} className="hover:bg-muted/30 transition-colors">
                    <td className="px-6 py-4">
                      <div className="font-semibold text-foreground">{email.to}</div>
                      <div className="text-muted-foreground text-xs mt-0.5 truncate max-w-[300px]">{email.subject}</div>
                    </td>
                    <td className="px-6 py-4">
                      <Badge 
                        variant="secondary" 
                        className={`
                          font-semibold rounded-md tracking-wider text-[10px] border border-border
                          ${email.status === 'pending' ? 'bg-amber-50 text-amber-600 border-amber-200 dark:bg-amber-500/10 dark:text-amber-400 dark:border-amber-500/20' : ''}
                          ${email.status === 'sent' ? 'bg-emerald-50 text-emerald-700 border-emerald-200 dark:bg-emerald-500/10 dark:text-emerald-400 dark:border-emerald-500/20' : ''}
                          ${email.status === 'failed' ? 'bg-destructive/10 text-destructive border-transparent' : ''}
                          ${email.status === 'cancelled' ? 'bg-muted text-muted-foreground border-transparent' : ''}
                        `}
                      >
                        {email.status === 'pending' && <Clock className="w-3 h-3 mr-1" />}
                        {email.status === 'sent' && <CheckCircle2 className="w-3 h-3 mr-1" />}
                        {email.status === 'failed' && <AlertCircle className="w-3 h-3 mr-1" />}
                        {email.status === 'cancelled' && <XCircle className="w-3 h-3 mr-1" />}
                        {email.status}
                      </Badge>
                    </td>
                    <td className="px-6 py-4 text-muted-foreground font-medium">
                      {new Date(email.scheduled_at).toLocaleString(undefined, {
                        dateStyle: 'medium',
                        timeStyle: 'short'
                      })}
                    </td>
                    <td className="px-6 py-4 text-right">
                      {email.status === 'pending' && (
                        <Button 
                          variant="ghost" 
                          size="sm" 
                          className="text-destructive hover:bg-destructive/10 hover:text-destructive h-8 px-2"
                          onClick={() => {
                            if (confirm("Are you sure you want to cancel this scheduled email?")) {
                              cancelEmail(email.id);
                            }
                          }}
                          disabled={isCancelling}
                        >
                          <Trash2 className="w-4 h-4 mr-1" />
                          Cancel
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
    </div>
  );
}
