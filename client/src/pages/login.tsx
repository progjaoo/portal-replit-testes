import { useState } from "react";
import { useAuth } from "@/hooks/use-auth";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";

export default function LoginPage() {
  const { login, isLoggingIn } = useAuth();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await login({ email, password });
    } catch (err: any) {
      setError(err.message);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-[#f8fafc] p-4">
      <Card className="w-full max-w-md shadow-xl border-none">
        <CardHeader className="space-y-1 text-center pb-8 pt-10">
          <div className="w-12 h-12 bg-primary rounded-xl flex items-center justify-center text-white font-bold text-2xl mx-auto mb-4">
            G
          </div>
          <CardTitle className="text-2xl font-display font-bold">GTF News CMS</CardTitle>
          <p className="text-sm text-muted-foreground">Entre com suas credenciais para acessar o painel</p>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            {error && (
              <div className="p-3 text-xs font-medium text-destructive bg-destructive/10 rounded-lg border border-destructive/20 text-center">
                {error}
              </div>
            )}
            <div className="space-y-2">
              <Label htmlFor="email">E-mail</Label>
              <Input id="email" type="email" placeholder="admin@gtf.com" required value={email} onChange={e => setEmail(e.target.value)} />
            </div>
            <div className="space-y-2">
              <Label htmlFor="password">Senha</Label>
              <Input id="password" type="password" required value={password} onChange={e => setPassword(e.target.value)} />
            </div>
            <Button type="submit" className="w-full h-11 text-base font-medium" disabled={isLoggingIn}>
              {isLoggingIn ? "Entrando..." : "Acessar Painel"}
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
