import { useState } from "react";
import { Layout } from "@/components/layout";
import { PageHeader } from "@/components/page-header";
import { usePosts, useCreatePost, useUpdatePost, useDeletePost } from "@/hooks/use-posts";
import { useEditoriais } from "@/hooks/use-editoriais";
import { useEmissoras } from "@/hooks/use-emissoras";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Edit, Trash2 } from "lucide-react";
import { format } from "date-fns";
import { ptBR } from "date-fns/locale";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import type { Post } from "@shared/schema";

export default function PostsPage() {
  const { data: posts, isLoading } = usePosts();
  const { data: editoriais } = useEditoriais();
  const { data: emissoras } = useEmissoras();
  
  const createMutation = useCreatePost();
  const updateMutation = useUpdatePost();
  const deleteMutation = useDeletePost();

  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingPost, setEditingPost] = useState<Post | null>(null);

  // Form State
  const [formData, setFormData] = useState({
    titulo: "", subtitulo: "", conteudo: "", slug: "", 
    statusPost: "1", editorialId: "", emissoraId: "",
    metaTitle: "", metaDescription: ""
  });

  const handleOpenDialog = (post?: Post) => {
    if (post) {
      setEditingPost(post);
      setFormData({
        titulo: post.titulo,
        subtitulo: post.subtitulo,
        conteudo: post.conteudo,
        slug: post.slug,
        statusPost: String(post.statusPost),
        editorialId: String(post.editorialId || ""),
        emissoraId: String(post.emissoraId || ""),
        metaTitle: post.metaTitle || "",
        metaDescription: post.metaDescription || ""
      });
    } else {
      setEditingPost(null);
      setFormData({ titulo: "", subtitulo: "", conteudo: "", slug: "", statusPost: "1", editorialId: "", emissoraId: "" });
    }
    setIsDialogOpen(true);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const payload = {
      titulo: formData.titulo,
      subtitulo: formData.subtitulo,
      conteudo: formData.conteudo,
      slug: formData.slug || formData.titulo.toLowerCase().replace(/[^a-z0-9]+/g, '-'),
      statusPost: parseInt(formData.statusPost),
      editorialId: formData.editorialId ? parseInt(formData.editorialId) : null,
      emissoraId: formData.emissoraId ? parseInt(formData.emissoraId) : null,
      metaTitle: formData.metaTitle,
      metaDescription: formData.metaDescription,
    };

    if (editingPost) {
      updateMutation.mutate({ id: editingPost.id, ...payload }, {
        onSuccess: () => setIsDialogOpen(false)
      });
    } else {
      createMutation.mutate(payload as any, {
        onSuccess: () => setIsDialogOpen(false)
      });
    }
  };

  const handleDelete = (id: number) => {
    if (confirm("Tem certeza que deseja remover este post?")) {
      deleteMutation.mutate(id);
    }
  };

  return (
    <Layout>
      <PageHeader 
        title="Gestão de Posts" 
        description="Crie, edite e publique notícias no portal."
        actionLabel="Novo Post"
        onAction={() => handleOpenDialog()}
      />

      <div className="bg-white rounded-2xl border border-border/50 shadow-sm overflow-hidden">
        <Table>
          <TableHeader className="bg-muted/50">
            <TableRow>
              <TableHead className="w-[300px]">Título</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>Data Criação</TableHead>
              <TableHead className="text-right">Ações</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {isLoading ? (
              <TableRow><TableCell colSpan={4} className="text-center py-8">Carregando...</TableCell></TableRow>
            ) : posts?.length === 0 ? (
              <TableRow><TableCell colSpan={4} className="text-center py-8 text-muted-foreground">Nenhum post encontrado.</TableCell></TableRow>
            ) : (
              posts?.map((post) => (
                <TableRow key={post.id} className="table-row-hover">
                  <TableCell className="font-medium">
                    <div className="truncate w-[280px]">{post.titulo}</div>
                  </TableCell>
                  <TableCell>
                    <Badge variant={post.statusPost === 2 ? "default" : "secondary"}>
                      {post.statusPost === 2 ? "Publicado" : "Rascunho"}
                    </Badge>
                  </TableCell>
                  <TableCell className="text-muted-foreground">
                    {post.dataCriacao ? format(new Date(post.dataCriacao), "dd/MM/yyyy", { locale: ptBR }) : '-'}
                  </TableCell>
                  <TableCell className="text-right">
                    <div className="flex justify-end gap-2">
                      <Button variant="ghost" size="icon" onClick={() => handleOpenDialog(post)}>
                        <Edit className="w-4 h-4 text-primary" />
                      </Button>
                      <Button variant="ghost" size="icon" onClick={() => handleDelete(post.id)}>
                        <Trash2 className="w-4 h-4 text-destructive" />
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </div>

      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>{editingPost ? "Editar Post" : "Criar Novo Post"}</DialogTitle>
          </DialogHeader>
          <form onSubmit={handleSubmit} className="space-y-4 mt-4">
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label>Título</Label>
                <Input required value={formData.titulo} onChange={e => setFormData({...formData, titulo: e.target.value})} />
              </div>
              <div className="space-y-2">
                <Label>Slug (URL)</Label>
                <Input placeholder="gerado-automaticamente" value={formData.slug} onChange={e => setFormData({...formData, slug: e.target.value})} />
              </div>
            </div>
            
            <div className="space-y-2">
              <Label>Subtítulo</Label>
              <Input required value={formData.subtitulo} onChange={e => setFormData({...formData, subtitulo: e.target.value})} />
            </div>

            <div className="space-y-2">
              <Label>Conteúdo</Label>
              <Textarea required className="min-h-[150px]" value={formData.conteudo} onChange={e => setFormData({...formData, conteudo: e.target.value})} />
            </div>

            <div className="grid grid-cols-3 gap-4">
              <div className="space-y-2">
                <Label>Status</Label>
                <Select value={formData.statusPost} onValueChange={v => setFormData({...formData, statusPost: v})}>
                  <SelectTrigger><SelectValue placeholder="Selecione..." /></SelectTrigger>
                  <SelectContent>
                    <SelectItem value="1">Rascunho</SelectItem>
                    <SelectItem value="2">Publicado</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              
              <div className="space-y-2">
                <Label>Editorial</Label>
                <Select value={formData.editorialId} onValueChange={v => setFormData({...formData, editorialId: v})}>
                  <SelectTrigger><SelectValue placeholder="Opcional" /></SelectTrigger>
                  <SelectContent>
                    {editoriais?.map(ed => (
                      <SelectItem key={ed.id} value={String(ed.id)}>{ed.tipoPostagem}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label>Emissora</Label>
                <Select value={formData.emissoraId} onValueChange={v => setFormData({...formData, emissoraId: v})}>
                  <SelectTrigger><SelectValue placeholder="Opcional" /></SelectTrigger>
                  <SelectContent>
                    {emissoras?.map(em => (
                      <SelectItem key={em.id} value={String(em.id)}>{em.nomeSocial}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label>Título (SEO)</Label>
                <Input value={formData.metaTitle} onChange={e => setFormData({...formData, metaTitle: e.target.value})} placeholder="Título para buscadores" />
              </div>
              <div className="space-y-2">
                <Label>Descrição (SEO)</Label>
                <Input value={formData.metaDescription} onChange={e => setFormData({...formData, metaDescription: e.target.value})} placeholder="Resumo para buscadores" />
              </div>
            </div>

            <DialogFooter className="pt-4">
              <Button type="button" variant="outline" onClick={() => setIsDialogOpen(false)}>Cancelar</Button>
              <Button type="submit" disabled={createMutation.isPending || updateMutation.isPending}>
                {editingPost ? "Salvar Alterações" : "Criar Post"}
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>
    </Layout>
  );
}
