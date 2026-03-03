import { useState } from "react";
import { Layout } from "@/components/layout";
import { PageHeader } from "@/components/page-header";
import { useEmissoras, useCreateEmissora, useUpdateEmissora, useDeleteEmissora } from "@/hooks/use-emissoras";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Edit, Trash2 } from "lucide-react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import type { Emissora } from "@shared/schema";

export default function EmissorasPage() {
  const { data: emissoras, isLoading } = useEmissoras();
  const createMutation = useCreateEmissora();
  const updateMutation = useUpdateEmissora();
  const deleteMutation = useDeleteEmissora();

  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingItem, setEditingItem] = useState<Emissora | null>(null);
  
  const [formData, setFormData] = useState({
    nomeSocial: "", razaoSocial: "", slug: "", logo: "", temaPrincipal: "", ativa: true
  });

  const handleOpenDialog = (item?: Emissora) => {
    if (item) {
      setEditingItem(item);
      setFormData({
        nomeSocial: item.nomeSocial, razaoSocial: item.razaoSocial, 
        slug: item.slug, logo: item.logo, temaPrincipal: item.temaPrincipal, ativa: item.ativa ?? true
      });
    } else {
      setEditingItem(null);
      setFormData({ nomeSocial: "", razaoSocial: "", slug: "", logo: "", temaPrincipal: "", ativa: true });
    }
    setIsDialogOpen(true);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (editingItem) {
      updateMutation.mutate({ id: editingItem.id, ...formData }, { onSuccess: () => setIsDialogOpen(false) });
    } else {
      createMutation.mutate(formData, { onSuccess: () => setIsDialogOpen(false) });
    }
  };

  const handleDelete = (id: number) => {
    if (confirm("Tem certeza que deseja remover esta emissora?")) {
      deleteMutation.mutate(id);
    }
  };

  return (
    <Layout>
      <PageHeader 
        title="Gestão de Emissoras" 
        description="Cadastre as emissoras de rádio e TV associadas."
        actionLabel="Nova Emissora"
        onAction={() => handleOpenDialog()}
      />

      <div className="bg-white rounded-2xl border border-border/50 shadow-sm overflow-hidden">
        <Table>
          <TableHeader className="bg-muted/50">
            <TableRow>
              <TableHead>Nome</TableHead>
              <TableHead>Tema Principal</TableHead>
              <TableHead>Status</TableHead>
              <TableHead className="text-right">Ações</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {isLoading ? (
              <TableRow><TableCell colSpan={4} className="text-center py-8">Carregando...</TableCell></TableRow>
            ) : emissoras?.length === 0 ? (
              <TableRow><TableCell colSpan={4} className="text-center py-8 text-muted-foreground">Nenhuma emissora encontrada.</TableCell></TableRow>
            ) : (
              emissoras?.map((item) => (
                <TableRow key={item.id} className="table-row-hover">
                  <TableCell className="font-medium">
                    {item.nomeSocial}
                    <div className="text-xs text-muted-foreground font-normal">{item.razaoSocial}</div>
                  </TableCell>
                  <TableCell>{item.temaPrincipal}</TableCell>
                  <TableCell>
                    <Badge variant={item.ativa ? "default" : "destructive"}>
                      {item.ativa ? "Ativa" : "Inativa"}
                    </Badge>
                  </TableCell>
                  <TableCell className="text-right">
                    <div className="flex justify-end gap-2">
                      <Button variant="ghost" size="icon" onClick={() => handleOpenDialog(item)}>
                        <Edit className="w-4 h-4 text-primary" />
                      </Button>
                      <Button variant="ghost" size="icon" onClick={() => handleDelete(item.id)}>
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
        <DialogContent>
          <DialogHeader>
            <DialogTitle>{editingItem ? "Editar Emissora" : "Nova Emissora"}</DialogTitle>
          </DialogHeader>
          <form onSubmit={handleSubmit} className="space-y-4 mt-4">
            <div className="space-y-2">
              <Label>Nome Social</Label>
              <Input required value={formData.nomeSocial} onChange={e => setFormData({...formData, nomeSocial: e.target.value})} />
            </div>
            <div className="space-y-2">
              <Label>Razão Social</Label>
              <Input required value={formData.razaoSocial} onChange={e => setFormData({...formData, razaoSocial: e.target.value})} />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label>Slug</Label>
                <Input required value={formData.slug} onChange={e => setFormData({...formData, slug: e.target.value})} />
              </div>
              <div className="space-y-2">
                <Label>Logo (URL)</Label>
                <Input required value={formData.logo} onChange={e => setFormData({...formData, logo: e.target.value})} />
              </div>
            </div>
            <div className="space-y-2">
              <Label>Tema Principal (Classe/Nome)</Label>
              <Input required value={formData.temaPrincipal} onChange={e => setFormData({...formData, temaPrincipal: e.target.value})} />
            </div>
            <div className="flex items-center space-x-2 pt-2">
              <Switch checked={formData.ativa} onCheckedChange={c => setFormData({...formData, ativa: c})} id="ativa-mode" />
              <Label htmlFor="ativa-mode">Emissora Ativa</Label>
            </div>
            <DialogFooter className="pt-4">
              <Button type="button" variant="outline" onClick={() => setIsDialogOpen(false)}>Cancelar</Button>
              <Button type="submit" disabled={createMutation.isPending || updateMutation.isPending}>
                Salvar
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>
    </Layout>
  );
}
