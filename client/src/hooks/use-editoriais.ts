import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { api } from "@shared/routes";
import type { CreateEditorialRequest } from "@shared/schema";
import { useToast } from "@/hooks/use-toast";

export function useEditoriais() {
  return useQuery({
    queryKey: [api.editoriais.list.path],
    queryFn: async () => {
      const res = await fetch(api.editoriais.list.path, { credentials: "include" });
      if (!res.ok) throw new Error("Falha ao buscar editoriais");
      return api.editoriais.list.responses[200].parse(await res.json());
    },
  });
}

export function useCreateEditorial() {
  const queryClient = useQueryClient();
  const { toast } = useToast();

  return useMutation({
    mutationFn: async (data: CreateEditorialRequest) => {
      const res = await fetch(api.editoriais.create.path, {
        method: api.editoriais.create.method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
        credentials: "include",
      });
      if (!res.ok) throw new Error("Falha ao criar editorial");
      return api.editoriais.create.responses[201].parse(await res.json());
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [api.editoriais.list.path] });
      toast({ title: "Sucesso", description: "Editorial criado!" });
    },
  });
}
