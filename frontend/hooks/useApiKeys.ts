import { useQuery } from "@tanstack/react-query";
import { api } from "../lib/api";

export interface ApiKey {
  id: string;
  key_hint: string;
  name: string;
  status: "active" | "revoked";
  created_at: string;
}

export function useApiKeys() {
  return useQuery({
    queryKey: ["api-keys"],
    queryFn: async () => {
      const res = await api.get<never, { success: boolean; data: ApiKey[] }>("/keys");
      return res.data;
    },
  });
}
