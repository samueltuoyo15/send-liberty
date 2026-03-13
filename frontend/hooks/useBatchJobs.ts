import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { api } from "../lib/api";

export interface BatchJob {
  id: string;
  name: string;
  total_count: number;
  sent_count: number;
  failed_count: number;
  status: "pending" | "running" | "completed" | "partial" | "failed" | "cancelled";
  created_at: string;
}

export function useBatchJobs() {
  return useQuery({
    queryKey: ["batch-jobs"],
    queryFn: async () => {
      const res = await api.get<never, { success: boolean; data: BatchJob[] }>("/email/batch");
      return res.data;
    },
    // Poll every 5 seconds if there are running jobs
    refetchInterval: (query) => {
      const jobs = query.state.data;
      const hasRunning = jobs?.some((job: BatchJob) => job.status === "running" || job.status === "pending");
      return hasRunning ? 5000 : false;
    },
  });
}

export function useCancelBatchJob() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (id: string) => {
      await api.delete(`/email/batch/${id}`);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["batch-jobs"] });
    },
  });
}
