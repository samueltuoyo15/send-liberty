import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { api } from "../lib/api";

export interface GmailAccount {
  id: string;
  email: string;
  connected: boolean;
  connectedAt: string;
  lastError?: string;
}

export function useGmailAccounts() {
  return useQuery({
    queryKey: ["gmail-accounts"],
    queryFn: async () => {
      const res = await api.get<never, { success: boolean; data: GmailAccount[] }>("/gmail/accounts");
      return res.data;
    },
  });
}

export function useConnectGmail() {
  return useMutation({
    mutationFn: async () => {
      const res = await api.get<never, { success: boolean; url: string }>("/gmail/connect");
      window.location.href = res.url;
    },
  });
}

export function useDisconnectGmail() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (email?: string) => {
      await api.delete(email ? `/gmail/accounts?email=${encodeURIComponent(email)}` : "/gmail/accounts");
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["gmail-accounts"] });
    },
  });
}
