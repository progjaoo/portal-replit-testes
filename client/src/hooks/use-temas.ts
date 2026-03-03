import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { api } from "@shared/routes";
import type { CreateTemaEditorialRequest } from "@shared/schema";
import { useToast } from "@/hooks/use-toast";

export function useTemaEditoriais() {
  return useQuery({
    queryKey: [api.temaEditoriais.list.path],
    queryFn: async () => {
      const res = await fetch(api.temaEditoriais.list.path, { credentials: "include" });
      if (!res.ok) throw new Error("Falha ao buscar temas editoriais");
      return api.temaEditoriais.list.responses[200].parse(await res.json());
    },
  });
}

export function useCreateTemaEditorial() {
  const queryClient = useQueryClient();
  const { toast } = useToast();

  return useMutation({
    mutationFn: async (data: CreateTemaEditorialRequest) => {
      const res = await fetch(api.temaEditoriais.create.path, {
        method: api.temaEditoriais.create.method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
        credentials: "include",
      });
      if (!res.ok) throw new Error("Falha ao criar tema editorial");
      return api.temaEditoriais.create.responses[201].parse(await res.json());
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [api.temaEditoriais.list.path] });
      toast({ title: "Sucesso", description: "Tema Editorial criado!" });
    },
  });
}
