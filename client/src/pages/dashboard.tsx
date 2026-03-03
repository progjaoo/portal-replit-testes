import { Layout } from "@/components/layout";
import { PageHeader } from "@/components/page-header";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { FileText, Radio, Tags, Palette } from "lucide-react";
import { usePosts } from "@/hooks/use-posts";
import { useEmissoras } from "@/hooks/use-emissoras";
import { useEditoriais } from "@/hooks/use-editoriais";
import { useTemaEditoriais } from "@/hooks/use-temas";

export default function Dashboard() {
  const { data: posts } = usePosts();
  const { data: emissoras } = useEmissoras();
  const { data: editoriais } = useEditoriais();
  const { data: temas } = useTemaEditoriais();

  const stats = [
    { title: "Total de Posts", value: posts?.length || 0, icon: FileText, color: "text-blue-500", bg: "bg-blue-500/10" },
    { title: "Emissoras Ativas", value: emissoras?.length || 0, icon: Radio, color: "text-emerald-500", bg: "bg-emerald-500/10" },
    { title: "Editoriais", value: editoriais?.length || 0, icon: Tags, color: "text-amber-500", bg: "bg-amber-500/10" },
    { title: "Temas Visuais", value: temas?.length || 0, icon: Palette, color: "text-purple-500", bg: "bg-purple-500/10" },
  ];

  return (
    <Layout>
      <PageHeader 
        title="Visão Geral" 
        description="Bem-vindo ao painel de controle do GTF News."
      />

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        {stats.map((stat, i) => (
          <Card key={i} className="border-border/50 shadow-sm hover:shadow-md transition-all duration-300">
            <CardHeader className="flex flex-row items-center justify-between pb-2 space-y-0">
              <CardTitle className="text-sm font-medium text-muted-foreground">{stat.title}</CardTitle>
              <div className={`w-10 h-10 rounded-full flex items-center justify-center ${stat.bg} ${stat.color}`}>
                <stat.icon className="w-5 h-5" />
              </div>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-display font-bold text-foreground">{stat.value}</div>
            </CardContent>
          </Card>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card className="border-border/50 shadow-sm">
          <CardHeader>
            <CardTitle>Últimos Posts</CardTitle>
          </CardHeader>
          <CardContent>
            {posts?.length === 0 ? (
              <p className="text-muted-foreground text-sm">Nenhum post encontrado.</p>
            ) : (
              <div className="space-y-4">
                {posts?.slice(0, 5).map(post => (
                  <div key={post.id} className="flex items-center justify-between border-b pb-3 last:border-0 last:pb-0">
                    <div>
                      <p className="font-medium text-sm truncate max-w-[250px]">{post.titulo}</p>
                      <p className="text-xs text-muted-foreground mt-1">
                        Status: {post.statusPost === 2 ? 'Publicado' : 'Rascunho'}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>

        <Card className="border-border/50 shadow-sm">
          <CardHeader>
            <CardTitle>Dicas de Sistema</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
             <div className="p-4 bg-primary/5 rounded-xl border border-primary/10">
               <h4 className="font-semibold text-primary mb-1">Mantenha a consistência visual</h4>
               <p className="text-sm text-muted-foreground">Associe sempre um Tema Editorial ao criar novas emissoras ou categorias de notícias.</p>
             </div>
             <div className="p-4 bg-amber-500/5 rounded-xl border border-amber-500/10">
               <h4 className="font-semibold text-amber-600 mb-1">Revisão de Conteúdo</h4>
               <p className="text-sm text-muted-foreground">Posts marcados como Rascunho não aparecerão no portal público até serem publicados.</p>
             </div>
          </CardContent>
        </Card>
      </div>
    </Layout>
  );
}
