import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
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

export function useUpdateProfile() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (data: { display_name?: string; avatar?: string; default_reply_to?: string }) => {
      const res = await api.patch<never, { success: boolean; data: User }>("/users/me", data);
      return res.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["me"] });
    },
  });
}

export function useSwitchMode() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (mode: "test_mode" | "live_mode") => {
      const res = await api.patch<never, { success: boolean; data: User }>("/users/mode", { mode });
      return res.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["me"] });
    },
  });
}
