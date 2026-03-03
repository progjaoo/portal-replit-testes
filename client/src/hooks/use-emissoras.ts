import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { api, buildUrl } from "@shared/routes";
import type { CreateEmissoraRequest } from "@shared/schema";
import { useToast } from "@/hooks/use-toast";

export function useEmissoras() {
  return useQuery({
    queryKey: [api.emissoras.list.path],
    queryFn: async () => {
      const res = await fetch(api.emissoras.list.path, { credentials: "include" });
      if (!res.ok) throw new Error("Falha ao buscar emissoras");
      return api.emissoras.list.responses[200].parse(await res.json());
    },
  });
}

export function useCreateEmissora() {
  const queryClient = useQueryClient();
  const { toast } = useToast();

  return useMutation({
    mutationFn: async (data: CreateEmissoraRequest) => {
      const res = await fetch(api.emissoras.create.path, {
        method: api.emissoras.create.method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
        credentials: "include",
      });
      if (!res.ok) throw new Error("Falha ao criar emissora");
      return api.emissoras.create.responses[201].parse(await res.json());
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [api.emissoras.list.path] });
      toast({ title: "Sucesso", description: "Emissora criada!" });
    },
  });
}

export function useUpdateEmissora() {
  const queryClient = useQueryClient();
  const { toast } = useToast();

  return useMutation({
    mutationFn: async ({ id, ...updates }: { id: number } & Partial<CreateEmissoraRequest>) => {
      const url = buildUrl(api.emissoras.update.path, { id });
      const res = await fetch(url, {
        method: api.emissoras.update.method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(updates),
        credentials: "include",
      });
      if (!res.ok) throw new Error("Falha ao atualizar emissora");
      return api.emissoras.update.responses[200].parse(await res.json());
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [api.emissoras.list.path] });
      toast({ title: "Sucesso", description: "Emissora atualizada!" });
    },
  });
}

export function useDeleteEmissora() {
  const queryClient = useQueryClient();
  const { toast } = useToast();

  return useMutation({
    mutationFn: async (id: number) => {
      const url = buildUrl(api.emissoras.delete.path, { id });
      const res = await fetch(url, { method: api.emissoras.delete.method, credentials: "include" });
      if (!res.ok) throw new Error("Falha ao deletar emissora");
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [api.emissoras.list.path] });
      toast({ title: "Sucesso", description: "Emissora removida!" });
    },
  });
}
