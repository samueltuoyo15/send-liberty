import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { api } from "../lib/api";

export type TemplateCategory = "auth" | "billing" | "account" | "custom";

export interface EmailTemplate {
  id: string;
  slug: string;
  name: string;
  category: TemplateCategory;
  description: string;
  subject: string;
  html: string;
  variables: string[];
  isDefault: boolean;
  createdAt: string;
  updatedAt: string;
}

export function useTemplates() {
  return useQuery({
    queryKey: ["templates"],
    queryFn: async () => {
      const res = await api.get<never, { success: boolean; data: EmailTemplate[] }>("/templates");
      return res.data;
    },
  });
}

export function useSaveTemplate() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (params: {
      id?: string;
      name: string;
      slug: string;
      subject: string;
      html: string;
      description?: string;
    }) => {
      if (params.id) {
        const res = await api.patch<never, { success: boolean; data: EmailTemplate }>(
          `/templates/${params.id}`,
          params
        );
        return res.data;
      }
      const res = await api.post<never, { success: boolean; data: EmailTemplate }>("/templates", params);
      return res.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["templates"] });
    },
  });
}

export function useResetTemplate() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (id: string) => {
      const res = await api.patch<never, { success: boolean; data: EmailTemplate }>(`/templates/${id}`, {
        reset: true,
      });
      return res.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["templates"] });
    },
  });
}

export function useDeleteTemplate() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (id: string) => {
      await api.delete(`/templates/${id}`);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["templates"] });
    },
  });
}

export function useRestoreDefaultTemplates() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async () => {
      const res = await api.post<
        never,
        { success: boolean; restored: number; data: EmailTemplate[] }
      >("/templates", { restoreDefaults: true });
      return res;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["templates"] });
    },
  });
}
