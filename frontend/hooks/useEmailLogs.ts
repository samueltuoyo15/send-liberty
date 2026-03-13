import { useQuery } from "@tanstack/react-query";
import { api } from "../lib/api";

export interface EmailLog {
  id: string;
  to: string;
  subject: string;
  status: "sent" | "failed";
  service_type: string;
  created_at: string;
}

export function useEmailLogs(page = 1, limit = 20) {
  return useQuery({
    queryKey: ["email-logs", page, limit],
    queryFn: async () => {
      const res = await api.get<never, { success: boolean; data: EmailLog[]; meta: any }>(`/email/logs?page=${page}&limit=${limit}`);
      return res.data;
    },
  });
}
