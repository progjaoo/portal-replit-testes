import { useState } from "react";
import { Layout } from "@/components/layout";
import { PageHeader } from "@/components/page-header";
import { useEditoriais, useCreateEditorial } from "@/hooks/use-editoriais";
import { useTemaEditoriais } from "@/hooks/use-temas";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

export default function EditoriaisPage() {
  const { data: editoriais, isLoading } = useEditoriais();
  const { data: temas } = useTemaEditoriais();
  const createMutation = useCreateEditorial();

  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [formData, setFormData] = useState({ tipoPostagem: "", temaEditorialId: "" });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    createMutation.mutate({
      tipoPostagem: formData.tipoPostagem,
      temaEditorialId: formData.temaEditorialId ? parseInt(formData.temaEditorialId) : null,
    } as any, { onSuccess: () => setIsDialogOpen(false) });
  };

  return (
    <Layout>
      <PageHeader 
        title="Editoriais" 
        description="Categorias e trilhas de publicação."
        actionLabel="Novo Editorial"
        onAction={() => { setFormData({tipoPostagem: "", temaEditorialId: ""}); setIsDialogOpen(true); }}
      />

      <div className="bg-white rounded-2xl border border-border/50 shadow-sm overflow-hidden">
        <Table>
          <TableHeader className="bg-muted/50">
            <TableRow>
              <TableHead>ID</TableHead>
              <TableHead>Tipo de Postagem</TableHead>
              <TableHead>ID do Tema</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {isLoading ? (
              <TableRow><TableCell colSpan={3} className="text-center py-8">Carregando...</TableCell></TableRow>
            ) : editoriais?.length === 0 ? (
              <TableRow><TableCell colSpan={3} className="text-center py-8 text-muted-foreground">Nenhum registro encontrado.</TableCell></TableRow>
            ) : (
              editoriais?.map((item) => (
                <TableRow key={item.id} className="table-row-hover">
                  <TableCell className="font-medium">{item.id}</TableCell>
                  <TableCell className="font-medium text-primary">{item.tipoPostagem}</TableCell>
                  <TableCell>{item.temaEditorialId || '-'}</TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </div>

      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent>
          <DialogHeader><DialogTitle>Novo Editorial</DialogTitle></DialogHeader>
          <form onSubmit={handleSubmit} className="space-y-4 mt-4">
            <div className="space-y-2">
              <Label>Nome (Tipo de Postagem)</Label>
              <Input required value={formData.tipoPostagem} onChange={e => setFormData({...formData, tipoPostagem: e.target.value})} />
            </div>
            <div className="space-y-2">
              <Label>Tema Visual Associado</Label>
              <Select value={formData.temaEditorialId} onValueChange={v => setFormData({...formData, temaEditorialId: v})}>
                <SelectTrigger><SelectValue placeholder="Selecione o tema..." /></SelectTrigger>
                <SelectContent>
                  {temas?.map(tema => (
                    <SelectItem key={tema.id} value={String(tema.id)}>{tema.descricao}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <DialogFooter className="pt-4">
              <Button type="button" variant="outline" onClick={() => setIsDialogOpen(false)}>Cancelar</Button>
              <Button type="submit" disabled={createMutation.isPending}>Salvar</Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>
    </Layout>
  );
}
