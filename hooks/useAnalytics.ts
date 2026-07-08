import { useQuery } from "@tanstack/react-query";
import { api } from "../lib/api";

export interface GmailCap {
  email: string;
  sentCount: number;
  limit: number;
  connected: boolean;
}

export interface VolumeDay {
  date: string;
  label: string;
  sent: number;
  failed: number;
}

export interface AnalyticsData {
  caps: GmailCap[];
  volume: VolumeDay[];
}

export function useAnalytics() {
  return useQuery({
    queryKey: ["analytics"],
    queryFn: async () => {
      const res = await api.get<never, { success: boolean; data: AnalyticsData }>("/analytics");
      return res.data;
    },
  });
}
