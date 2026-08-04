import { useState, useEffect } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { api } from "../lib/api";

export interface User {
  id: string;
  displayName: string;
  avatar?: string;
  email?: string;
  createdAt: string;
}

export function useMe() {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setMounted(true);
  }, []);

  const hasToken = typeof window !== "undefined" && document.cookie.includes("logged_in=true");

  const query = useQuery({
    queryKey: ["me"],
    queryFn: async () => {
      const res = await api.get<never, { success: boolean; data: User }>("/auth/me");
      return res.data;
    },
    enabled: hasToken && mounted,
    retry: false,
    staleTime: 5 * 60 * 1000,
  });

  const isLoading = !mounted || (hasToken && query.isLoading);

  return {
    ...query,
    isLoading,
    hasToken,
    isUnauthenticated: mounted && !hasToken,
  };
}

export function useUpdateProfile() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (data: { displayName?: string }) => {
      const res = await api.patch<never, { success: boolean; data: User }>("/user", data);
      return res.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["me"] });
    },
  });
}

export function useLogout() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async () => {
      await api.post("/auth/logout");
    },
    onSuccess: () => {
      queryClient.clear();
      window.location.href = "/login";
    },
  });
}

