import { useState } from "react";
import { Layout } from "@/components/layout";
import { PageHeader } from "@/components/page-header";
import { useMedia, useCreateMedia } from "@/hooks/use-media";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Image as ImageIcon, Video, FileText, Plus } from "lucide-react";

export default function MediaPage() {
  const { data: mediaItems, isLoading } = useMedia();
  const createMutation = useCreateMedia();
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [formData, setFormData] = useState({ nome: "", url: "", tipo: "imagem" });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    createMutation.mutate(formData, { onSuccess: () => setIsDialogOpen(false) });
  };

  return (
    <Layout>
      <PageHeader 
        title="Mídias e Arquivos" 
        description="Gestão de imagens, vídeos e documentos do portal."
        actionLabel="Novo Arquivo"
        onAction={() => { setFormData({nome: "", url: "", tipo: "imagem"}); setIsDialogOpen(true); }}
      />

      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
        {isLoading ? (
          <p>Carregando...</p>
        ) : mediaItems?.length === 0 ? (
          <div className="col-span-full text-center py-20 bg-white rounded-2xl border border-dashed border-border/60">
            <p className="text-muted-foreground">Nenhuma mídia encontrada. Comece enviando um arquivo.</p>
          </div>
        ) : (
          mediaItems?.map((item) => (
            <Card key={item.id} className="overflow-hidden group hover-elevate">
              <div className="aspect-video bg-muted flex items-center justify-center overflow-hidden">
                {item.tipo === 'imagem' ? (
                  <img src={item.url} alt={item.nome} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300" />
                ) : item.tipo === 'video' ? (
                  <Video className="w-10 h-10 text-muted-foreground" />
                ) : (
                  <FileText className="w-10 h-10 text-muted-foreground" />
                )}
              </div>
              <CardHeader className="p-3">
                <CardTitle className="text-sm truncate">{item.nome}</CardTitle>
              </CardHeader>
            </Card>
          ))
        )}
      </div>

      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent>
          <DialogHeader><DialogTitle>Adicionar Mídia</DialogTitle></DialogHeader>
          <form onSubmit={handleSubmit} className="space-y-4 mt-4">
            <div className="space-y-2">
              <Label>Nome do Arquivo</Label>
              <Input required value={formData.nome} onChange={e => setFormData({...formData, nome: e.target.value})} />
            </div>
            <div className="space-y-2">
              <Label>Tipo</Label>
              <Select value={formData.tipo} onValueChange={v => setFormData({...formData, tipo: v})}>
                <SelectTrigger><SelectValue /></SelectTrigger>
                <SelectContent>
                  <SelectItem value="imagem">Imagem</SelectItem>
                  <SelectItem value="video">Vídeo</SelectItem>
                  <SelectItem value="documento">Documento</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label>URL do Arquivo</Label>
              <Input required placeholder="https://..." value={formData.url} onChange={e => setFormData({...formData, url: e.target.value})} />
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
