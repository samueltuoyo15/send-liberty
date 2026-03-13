import { useQuery } from "@tanstack/react-query";
import { api } from "../lib/api";

export interface User {
  id: string;
  github_username: string;
  display_name: string;
  avatar: string;
  email?: string;
  mode: "test_mode" | "live_mode";
  credits: number;
  monthly_usage: number;
  monthly_limit: number;
}

export function useMe() {
  return useQuery({
    queryKey: ["me"],
    queryFn: async () => {
      const res = await api.get<never, { success: boolean; data: User }>("/users/me");
      return res.data;
    },
  });
}
