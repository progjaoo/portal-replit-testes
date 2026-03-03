import { useState } from "react";
import { Layout } from "@/components/layout";
import { PageHeader } from "@/components/page-header";
import { useTemaEditoriais, useCreateTemaEditorial } from "@/hooks/use-temas";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

export default function TemaEditoriaisPage() {
  const { data: temas, isLoading } = useTemaEditoriais();
  const createMutation = useCreateTemaEditorial();

  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [formData, setFormData] = useState({
    descricao: "", corPrimaria: "#3b82f6", corSecundaria: "#1e40af", corFonte: "#ffffff", logo: ""
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    createMutation.mutate(formData, { onSuccess: () => setIsDialogOpen(false) });
  };

  return (
    <Layout>
      <PageHeader 
        title="Temas Visuais" 
        description="Gerencie as paletas de cores e identidades de cada editorial."
        actionLabel="Novo Tema"
        onAction={() => { setFormData({descricao: "", corPrimaria: "#3b82f6", corSecundaria: "#1e40af", corFonte: "#ffffff", logo: ""}); setIsDialogOpen(true); }}
      />

      <div className="bg-white rounded-2xl border border-border/50 shadow-sm overflow-hidden">
        <Table>
          <TableHeader className="bg-muted/50">
            <TableRow>
              <TableHead>Descrição</TableHead>
              <TableHead>Cor Primária</TableHead>
              <TableHead>Cor Secundária</TableHead>
              <TableHead>Cor da Fonte</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {isLoading ? (
              <TableRow><TableCell colSpan={4} className="text-center py-8">Carregando...</TableCell></TableRow>
            ) : temas?.length === 0 ? (
              <TableRow><TableCell colSpan={4} className="text-center py-8 text-muted-foreground">Nenhum tema encontrado.</TableCell></TableRow>
            ) : (
              temas?.map((item) => (
                <TableRow key={item.id} className="table-row-hover">
                  <TableCell className="font-medium font-display">{item.descricao}</TableCell>
                  <TableCell>
                    <div className="flex items-center gap-2">
                      <div className="w-6 h-6 rounded-md shadow-sm border border-black/10" style={{ backgroundColor: item.corPrimaria }}></div>
                      <span className="text-xs uppercase font-mono text-muted-foreground">{item.corPrimaria}</span>
                    </div>
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center gap-2">
                      <div className="w-6 h-6 rounded-md shadow-sm border border-black/10" style={{ backgroundColor: item.corSecundaria }}></div>
                      <span className="text-xs uppercase font-mono text-muted-foreground">{item.corSecundaria}</span>
                    </div>
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center gap-2">
                      <div className="w-6 h-6 rounded-md shadow-sm border border-black/10" style={{ backgroundColor: item.corFonte }}></div>
                      <span className="text-xs uppercase font-mono text-muted-foreground">{item.corFonte}</span>
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
          <DialogHeader><DialogTitle>Criar Tema Visual</DialogTitle></DialogHeader>
          <form onSubmit={handleSubmit} className="space-y-4 mt-4">
            <div className="space-y-2">
              <Label>Descrição / Nome do Tema</Label>
              <Input required value={formData.descricao} onChange={e => setFormData({...formData, descricao: e.target.value})} />
            </div>
            
            <div className="grid grid-cols-3 gap-4">
              <div className="space-y-2">
                <Label>Primária</Label>
                <div className="flex items-center gap-2">
                  <Input type="color" className="w-12 p-1 h-10 cursor-pointer" required value={formData.corPrimaria} onChange={e => setFormData({...formData, corPrimaria: e.target.value})} />
                </div>
              </div>
              <div className="space-y-2">
                <Label>Secundária</Label>
                <div className="flex items-center gap-2">
                  <Input type="color" className="w-12 p-1 h-10 cursor-pointer" required value={formData.corSecundaria} onChange={e => setFormData({...formData, corSecundaria: e.target.value})} />
                </div>
              </div>
              <div className="space-y-2">
                <Label>Cor Fonte</Label>
                <div className="flex items-center gap-2">
                  <Input type="color" className="w-12 p-1 h-10 cursor-pointer" required value={formData.corFonte} onChange={e => setFormData({...formData, corFonte: e.target.value})} />
                </div>
              </div>
            </div>

            <div className="space-y-2">
              <Label>Logo (URL)</Label>
              <Input required value={formData.logo} onChange={e => setFormData({...formData, logo: e.target.value})} />
            </div>
            
            <DialogFooter className="pt-4">
              <Button type="button" variant="outline" onClick={() => setIsDialogOpen(false)}>Cancelar</Button>
              <Button type="submit" disabled={createMutation.isPending}>Salvar Tema</Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>
    </Layout>
  );
}
