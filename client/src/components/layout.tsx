import { Link, useLocation } from "wouter";
import { 
  Sidebar, 
  SidebarContent, 
  SidebarGroup, 
  SidebarGroupContent, 
  SidebarGroupLabel, 
  SidebarMenu, 
  SidebarMenuButton, 
  SidebarMenuItem, 
  SidebarProvider, 
  SidebarTrigger 
} from "@/components/ui/sidebar";
import { LayoutDashboard, FileText, Tags, Palette, Radio, LogOut, Image as ImageIcon } from "lucide-react";
import { useAuth } from "@/hooks/use-auth";

const navItems = [
  { title: "Dashboard", url: "/", icon: LayoutDashboard },
  { title: "Posts", url: "/posts", icon: FileText },
  { title: "Mídias", url: "/media", icon: ImageIcon },
  { title: "Editoriais", url: "/editoriais", icon: Tags },
  { title: "Temas Editoriais", url: "/temas", icon: Palette },
  { title: "Emissoras", url: "/emissoras", icon: Radio },
];

export function AppSidebar() {
  const [location] = useLocation();
  const { logout } = useAuth();

  return (
    <Sidebar className="border-r-0 shadow-lg">
      <SidebarContent className="bg-sidebar-background">
        <div className="p-6 mb-4 flex items-center gap-3">
          <div className="w-8 h-8 rounded-lg bg-primary flex items-center justify-center text-primary-foreground font-bold">
            G
          </div>
          <h1 className="font-display font-bold text-xl tracking-tight text-sidebar-foreground">
            GTF News CMS
          </h1>
        </div>
        <SidebarGroup>
          <SidebarGroupLabel className="text-sidebar-foreground/50 uppercase text-xs tracking-wider font-semibold">
            Gestão de Conteúdo
          </SidebarGroupLabel>
          <SidebarGroupContent className="mt-2">
            <SidebarMenu>
              {navItems.map((item) => (
                <SidebarMenuItem key={item.title}>
                  <SidebarMenuButton 
                    asChild 
                    isActive={location === item.url}
                    className={`
                      data-[active=true]:bg-primary/10 data-[active=true]:text-primary 
                      data-[active=true]:font-medium transition-all duration-200
                      hover:bg-white/5 text-sidebar-foreground/80
                    `}
                  >
                    <Link href={item.url} className="flex items-center gap-3 px-3 py-2">
                      <item.icon className="w-5 h-5" />
                      <span>{item.title}</span>
                    </Link>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
        
        <div className="mt-auto p-4">
           <SidebarMenuButton 
             onClick={() => logout()}
             className="w-full text-sidebar-foreground/70 hover:bg-destructive/10 hover:text-destructive flex items-center gap-3"
           >
              <LogOut className="w-4 h-4" />
              <span>Sair do sistema</span>
           </SidebarMenuButton>
        </div>
      </SidebarContent>
    </Sidebar>
  );
}

export function Layout({ children }: { children: React.ReactNode }) {
  const { user, isLoading } = useAuth();
  const [, setLocation] = useLocation();

  if (isLoading) return null;
  if (!user && window.location.pathname !== "/login") {
    setLocation("/login");
    return null;
  }

  const style = {
    "--sidebar-width": "18rem",
    "--sidebar-width-icon": "4rem",
  } as React.CSSProperties;

  return (
    <SidebarProvider style={style}>
      <div className="flex min-h-screen w-full bg-[#f8fafc]">
        <AppSidebar />
        <div className="flex flex-col flex-1 w-full overflow-hidden">
          <header className="h-16 flex items-center px-6 bg-white border-b border-border/40 shadow-sm z-10 shrink-0">
            <SidebarTrigger className="text-muted-foreground hover:text-foreground" />
            <div className="ml-auto flex items-center gap-4">
              <div className="w-8 h-8 rounded-full bg-primary/10 text-primary flex items-center justify-center font-semibold text-sm">
                {user?.nomeCompleto?.charAt(0) || "A"}
              </div>
              <span className="text-sm font-medium text-foreground">{user?.nomeCompleto || "Admin"}</span>
            </div>
          </header>
          <main className="flex-1 overflow-auto p-6 md:p-8 w-full max-w-7xl mx-auto">
            <div className="animate-in fade-in slide-in-from-bottom-4 duration-500">
              {children}
            </div>
          </main>
        </div>
      </div>
    </SidebarProvider>
  );
}
