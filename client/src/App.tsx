import { Switch, Route } from "wouter";
import { queryClient } from "./lib/queryClient";
import { QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import NotFound from "@/pages/not-found";

// Pages
import Dashboard from "./pages/dashboard";
import PostsPage from "./pages/posts";
import EmissorasPage from "./pages/emissoras";
import EditoriaisPage from "./pages/editoriais";
import TemaEditoriaisPage from "./pages/temas";

function Router() {
  return (
    <Switch>
      <Route path="/" component={Dashboard}/>
      <Route path="/posts" component={PostsPage}/>
      <Route path="/emissoras" component={EmissorasPage}/>
      <Route path="/editoriais" component={EditoriaisPage}/>
      <Route path="/temas" component={TemaEditoriaisPage}/>
      <Route component={NotFound} />
    </Switch>
  );
}

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <Toaster />
        <Router />
      </TooltipProvider>
    </QueryClientProvider>
  );
}

export default App;
