import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { api } from "../lib/api";

export interface CreditPackage {
  id: string;
  credits: number;
  amount: number;
  amountNGN: number;
}

export interface PaymentInitResponse {
  authorization_url: string;
  access_code: string;
  reference: string;
}

export function useCreditPackages() {
  return useQuery({
    queryKey: ["credit-packages"],
    queryFn: async () => {
      const res = await api.get<never, { success: boolean; data: CreditPackage[] }>("/payments/packages");
      return res.data;
    },
  });
}

export function useInitializePayment() {
  return useMutation({
    mutationFn: async (packageId: string) => {
      const res = await api.post<never, { success: boolean; data: PaymentInitResponse }>("/payments/initialize", { packageId });
      return res.data;
    },
  });
}

export function useVerifyPayment() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (reference: string) => {
      const res = await api.get<never, { success: boolean; data: any }>(`/payments/verify/${reference}`);
      return res.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["me"] });
    },
  });
}
