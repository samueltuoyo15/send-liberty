import { useQuery } from "@tanstack/react-query";
import { api } from "../lib/api";

export interface EmailLog {
  _id: string;
  to: string;
  subject: string;
  status: "sent" | "failed";
  provider: "gmail";
  messageId?: string;
  error?: string;
  createdAt: string;
}

export function useEmailLogs(page = 1, limit = 20) {
  return useQuery({
    queryKey: ["email-logs", page, limit],
    queryFn: async () => {
      const res = await api.get<
        never,
        { success: boolean; data: EmailLog[]; meta: { page: number; limit: number; total: number; totalPages: number } }
      >(`/logs?page=${page}&limit=${limit}`);
      return res;
    },
  });
}
