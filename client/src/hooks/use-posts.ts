import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { api, buildUrl } from "@shared/routes";
import type { CreatePostRequest, UpdatePostRequest } from "@shared/schema";
import { useToast } from "@/hooks/use-toast";

export function usePosts() {
  return useQuery({
    queryKey: [api.posts.list.path],
    queryFn: async () => {
      const res = await fetch(api.posts.list.path, { credentials: "include" });
      if (!res.ok) throw new Error("Falha ao buscar posts");
      return api.posts.list.responses[200].parse(await res.json());
    },
  });
}

export function usePost(id: number) {
  return useQuery({
    queryKey: [api.posts.get.path, id],
    queryFn: async () => {
      const url = buildUrl(api.posts.get.path, { id });
      const res = await fetch(url, { credentials: "include" });
      if (res.status === 404) return null;
      if (!res.ok) throw new Error("Falha ao buscar post");
      return api.posts.get.responses[200].parse(await res.json());
    },
    enabled: !!id,
  });
}

export function useCreatePost() {
  const queryClient = useQueryClient();
  const { toast } = useToast();
  
  return useMutation({
    mutationFn: async (data: CreatePostRequest) => {
      const res = await fetch(api.posts.create.path, {
        method: api.posts.create.method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
        credentials: "include",
      });
      if (!res.ok) {
        const error = await res.json().catch(() => ({ message: "Erro desconhecido" }));
        throw new Error(error.message || "Falha ao criar post");
      }
      return api.posts.create.responses[201].parse(await res.json());
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [api.posts.list.path] });
      toast({ title: "Sucesso", description: "Post criado com sucesso!" });
    },
    onError: (error) => {
      toast({ title: "Erro", description: error.message, variant: "destructive" });
    }
  });
}

export function useUpdatePost() {
  const queryClient = useQueryClient();
  const { toast } = useToast();

  return useMutation({
    mutationFn: async ({ id, ...updates }: { id: number } & UpdatePostRequest) => {
      const url = buildUrl(api.posts.update.path, { id });
      const res = await fetch(url, {
        method: api.posts.update.method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(updates),
        credentials: "include",
      });
      if (!res.ok) throw new Error("Falha ao atualizar post");
      return api.posts.update.responses[200].parse(await res.json());
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [api.posts.list.path] });
      toast({ title: "Sucesso", description: "Post atualizado com sucesso!" });
    },
    onError: (error) => {
      toast({ title: "Erro", description: error.message, variant: "destructive" });
    }
  });
}

export function useDeletePost() {
  const queryClient = useQueryClient();
  const { toast } = useToast();

  return useMutation({
    mutationFn: async (id: number) => {
      const url = buildUrl(api.posts.delete.path, { id });
      const res = await fetch(url, { method: api.posts.delete.method, credentials: "include" });
      if (!res.ok) throw new Error("Falha ao deletar post");
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [api.posts.list.path] });
      toast({ title: "Sucesso", description: "Post deletado com sucesso!" });
    },
    onError: (error) => {
      toast({ title: "Erro", description: error.message, variant: "destructive" });
    }
  });
}
