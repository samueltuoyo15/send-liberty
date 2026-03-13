import { useQuery } from "@tanstack/react-query";
import { api } from "../lib/api";

export interface GmailAccount {
  id: string;
  email: string;
  connected: boolean;
  created_at: string;
}

export function useGmailAccounts() {
  return useQuery({
    queryKey: ["gmail-accounts"],
    queryFn: async () => {
      const res = await api.get<never, { success: boolean; data: GmailAccount[] }>("/gmail");
      return res.data;
    },
  });
}
