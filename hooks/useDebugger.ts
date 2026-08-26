import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { api } from "../lib/api";

export interface DebugStep {
  key: string;
  label: string;
  ok: boolean;
  skipped?: boolean;
  detail: string;
}

export interface DebugIssue {
  severity: "warning" | "error";
  code: string;
  title: string;
  hint: string;
}

export interface DebugReport {
  health: "healthy" | "warnings" | "failed";
  steps: DebugStep[];
  issues: DebugIssue[];
  htmlBytes?: number;
  templateSlug?: string;
  htmlSize?: string;
  subject?: string;
}

export interface DebuggerLog {
  id: string;
  from?: string;
  to: string;
  subject: string;
  status: "sent" | "failed";
  messageId?: string;
  error?: string;
  templateSlug?: string;
  debug: DebugReport | null;
  createdAt: string;
}

export function useDebuggerLogs() {
  return useQuery({
    queryKey: ["debugger-logs"],
    queryFn: async () => {
      const res = await api.get<never, { success: boolean; data: DebuggerLog[] }>("/debugger");
      return res.data;
    },
  });
}

export function useInspectEmail() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (payload: {
      send?: boolean;
      template?: string;
      data?: Record<string, unknown>;
      html?: string;
      text?: string;
      subject?: string;
      to?: string;
      from?: string;
    }) => {
      const res = await api.post<
        never,
        { success: boolean; sent?: boolean; message?: string; messageId?: string | null; data: DebugReport }
      >("/debugger", payload);
      return {
        sent: !!res.sent,
        message: res.message,
        messageId: res.messageId,
        debug: res.data,
      };
    },
    onSuccess: (result) => {
      if (result.sent) {
        queryClient.invalidateQueries({ queryKey: ["debugger-logs"] });
        queryClient.invalidateQueries({ queryKey: ["email-logs"] });
        queryClient.invalidateQueries({ queryKey: ["analytics"] });
      }
    },
  });
}
