import { useQuery, useMutation } from "@tanstack/react-query";
import { api } from "@shared/routes";
import { queryClient } from "@/lib/queryClient";
import { Media, CreateMediaRequest } from "@shared/schema";

export function useMedia() {
  return useQuery<Media[]>({
    queryKey: [api.media.list.path],
  });
}

export function useCreateMedia() {
  return useMutation({
    mutationFn: async (m: CreateMediaRequest) => {
      const res = await fetch(api.media.create.path, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(m),
      });
      return res.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [api.media.list.path] });
    },
  });
}
