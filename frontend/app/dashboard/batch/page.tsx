"use client";

import { Layers, Trash2, Activity, CheckCircle2, XCircle, AlertCircle, PlayCircle, Clock } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { useBatchJobs, useCancelBatchJob, BatchJob } from "@/hooks/useBatchJobs";

export default function BatchJobsPage() {
  const { data: response, isLoading } = useBatchJobs();
  const { mutate: cancelBatch, isPending: isCancelling } = useCancelBatchJob();
  
  const jobs = response || [];

  return (
    <div className="space-y-6 max-w-[1200px] mx-auto">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Batch Sending</h1>
          <p className="text-muted-foreground mt-1">
            Monitor and manage your bulk email operations.
          </p>
        </div>
        <Button className="font-semibold shadow-md">
          <Layers className="w-4 h-4 mr-2" />
          New Batch Job
        </Button>
      </div>

      <div className="rounded-xl border border-border bg-card overflow-hidden shadow-sm">
        <div className="overflow-x-auto">
          <table className="w-full text-sm text-left whitespace-nowrap">
            <thead className="bg-muted/50 border-b border-border text-muted-foreground font-medium">
              <tr>
                <th className="px-6 py-4">Batch Name</th>
                <th className="px-6 py-4">Status</th>
                <th className="px-6 py-4">Progress</th>
                <th className="px-6 py-4">Created Date</th>
                <th className="px-6 py-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border">
              {isLoading ? (
                Array.from({ length: 4 }).map((_, i) => (
                  <tr key={i}>
                    <td className="px-6 py-4"><Skeleton className="h-6 w-32" /></td>
                    <td className="px-6 py-4"><Skeleton className="h-5 w-20" /></td>
                    <td className="px-6 py-4"><Skeleton className="h-4 w-48" /></td>
                    <td className="px-6 py-4"><Skeleton className="h-4 w-24" /></td>
                    <td className="px-6 py-4"><Skeleton className="h-8 w-16 ml-auto" /></td>
                  </tr>
                ))
              ) : jobs.length === 0 ? (
                <tr>
                  <td colSpan={5} className="px-6 py-12 text-center text-muted-foreground">
                    No batch jobs found.
                  </td>
                </tr>
              ) : (
                jobs.map((job: BatchJob) => {
                  const progressPercentage = job.total_count > 0 
                    ? Math.round(((job.sent_count + job.failed_count) / job.total_count) * 100) 
                    : 0;
                    
                  return (
                    <tr key={job.id} className="hover:bg-muted/30 transition-colors">
                      <td className="px-6 py-4">
                        <div className="font-semibold text-foreground flex items-center gap-2">
                          {job.name || "Unnamed Batch"}
                        </div>
                        <div className="text-muted-foreground text-xs mt-0.5 font-mono">
                          {job.id.slice(0, 8)}...
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <Badge 
                          variant="secondary" 
                          className={`
                            font-semibold rounded-md tracking-wider text-[10px] border border-border
                            ${job.status === 'pending' ? 'bg-muted text-muted-foreground border-transparent' : ''}
                            ${job.status === 'running' ? 'bg-blue-50 text-blue-600 border-blue-200 dark:bg-blue-500/10 dark:text-blue-400 dark:border-blue-500/20' : ''}
                            ${job.status === 'completed' ? 'bg-emerald-50 text-emerald-700 border-emerald-200 dark:bg-emerald-500/10 dark:text-emerald-400 dark:border-emerald-500/20' : ''}
                            ${job.status === 'partial' || job.status === 'failed' ? 'bg-destructive/10 text-destructive border-transparent' : ''}
                            ${job.status === 'cancelled' ? 'bg-stone-100 text-stone-500 border-stone-200 dark:bg-stone-800 dark:text-stone-400 dark:border-stone-700' : ''}
                          `}
                        >
                          {job.status === 'pending' && <Clock className="w-3 h-3 mr-1" />}
                          {job.status === 'running' && <Activity className="w-3 h-3 mr-1 animate-pulse" />}
                          {job.status === 'completed' && <CheckCircle2 className="w-3 h-3 mr-1" />}
                          {job.status === 'partial' && <AlertCircle className="w-3 h-3 mr-1" />}
                          {job.status === 'failed' && <XCircle className="w-3 h-3 mr-1" />}
                          {job.status === 'cancelled' && <XCircle className="w-3 h-3 mr-1" />}
                          {job.status}
                        </Badge>
                      </td>
                      <td className="px-6 py-4 min-w-[200px]">
                        <div className="flex flex-col gap-1.5 w-full">
                          <div className="flex justify-between text-xs font-medium">
                            <span>{progressPercentage}%</span>
                            <span className="text-muted-foreground">
                              {job.sent_count + job.failed_count} / {job.total_count}
                            </span>
                          </div>
                          <div className="w-full bg-muted rounded-full h-1.5 overflow-hidden flex">
                            <div className="bg-emerald-500 h-full transition-all" style={{ width: `${(job.sent_count / job.total_count) * 100}%` }} />
                            <div className="bg-destructive h-full transition-all" style={{ width: `${(job.failed_count / job.total_count) * 100}%` }} />
                          </div>
                          {(job.failed_count > 0 || job.sent_count > 0) && (
                            <div className="text-[10px] text-muted-foreground flex gap-3">
                              {job.sent_count > 0 && <span className="text-emerald-600 dark:text-emerald-400">{job.sent_count} sent</span>}
                              {job.failed_count > 0 && <span className="text-destructive">{job.failed_count} failed</span>}
                            </div>
                          )}
                        </div>
                      </td>
                      <td className="px-6 py-4 text-muted-foreground font-medium">
                        {new Date(job.created_at).toLocaleDateString()}
                      </td>
                      <td className="px-6 py-4 text-right">
                        {(job.status === 'pending' || job.status === 'running') && (
                          <Button 
                            variant="ghost" 
                            size="sm" 
                            className="text-destructive hover:bg-destructive/10 hover:text-destructive h-8 px-2"
                            onClick={() => {
                              if (confirm("Are you sure you want to cancel this batch job? Currently running emails cannot be stopped.")) {
                                cancelBatch(job.id);
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
                  );
                })
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
