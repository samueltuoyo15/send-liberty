import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { api } from "../lib/api";

export interface ScheduledEmail {
  id: string;
  to: string;
  subject: string;
  status: "pending" | "sent" | "failed" | "cancelled";
  scheduled_at: string;
  service: string;
}

export function useScheduledEmails(status?: string) {
  return useQuery({
    queryKey: ["scheduled-emails", status],
    queryFn: async () => {
      const params = new URLSearchParams();
      if (status) params.append("status", status);
      const res = await api.get<never, { success: boolean; data: ScheduledEmail[] }>(`/email/scheduled?${params.toString()}`);
      return res.data;
    },
  });
}

export function useCancelScheduledEmail() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (id: string) => {
      await api.delete(`/email/scheduled/${id}`);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["scheduled-emails"] });
    },
  });
}
