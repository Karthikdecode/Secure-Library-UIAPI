import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { useState, type FormEvent } from "react";
import { Library } from "lucide-react";
import { toast } from "sonner";
import { useAuth } from "@/lib/auth";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { motion } from "framer-motion";

export const Route = createFileRoute("/login")({
  ssr: false,
  component: LoginPage,
});

function LoginPage() {
  const { login } = useAuth();
  const nav = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [err, setErr] = useState<{ email?: string; password?: string; form?: string }>({});

  const submit = async (e: FormEvent) => {
    e.preventDefault();
    const errs: typeof err = {};
    if (!email) errs.email = "Email is required";
    else if (!/^\S+@\S+\.\S+$/.test(email)) errs.email = "Invalid email";
    if (!password) errs.password = "Password is required";
    setErr(errs);
    if (Object.keys(errs).length) return;
    setLoading(true);
    try {
      await login(email, password);
      toast.success("Logged in");
      nav({ to: "/dashboard" });
    } catch (e: any) {
      setErr({ form: e.message || "Login failed" });
      toast.error("Login failed");
    } finally {
      setLoading(false);
    }
  };


  return (
  <div className="min-h-screen grid lg:grid-cols-2">
    {/* Left Side */}
    <motion.div
  initial={{ x: -150, opacity: 0 }}
  animate={{ x: 0, opacity: 1 }}
  transition={{ duration: 0.8 }}
  className="hidden lg:block relative"
>
  <img
            src="https://images.unsplash.com/photo-1521587760476-6c12a4b040da?auto=format&fit=crop&w=1200&q=80"

    alt="Library"
    className="h-full w-full object-cover"
  />

  <div className="absolute inset-0 bg-black/50" />

  <div className="absolute inset-0 flex flex-col justify-center items-center text-white">
    <Library className="h-16 w-16 mb-6" />
    <h1 className="text-5xl font-bold">SecureLib</h1>
    <p className="mt-4 text-center max-w-md text-lg">
     Manage your library efficiently with a modern, secure and easy-to-use platform. Log in to access your dashboard and start managing books, members, and borrowing records seamlessly.
    </p>
  </div>
</motion.div>

    {/* Right Side */}
    <div className="flex items-center justify-center bg-muted/40 px-6">
      <Card className="w-full max-w-md shadow-lg">
        <CardHeader className="items-center text-center">
          <div className="flex items-center gap-2 text-2xl font-semibold">
            <Library className="text-primary" />
            SecureLib
          </div>
          <p className="mt-1 text-sm text-muted-foreground">
            Welcome back — sign in to continue
          </p>
        </CardHeader>

        <CardContent>
          <form onSubmit={submit} className="space-y-4" noValidate>
            <div className="space-y-1">
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="admin@example.com"
              />
              {err.email && (
                <p className="text-xs text-destructive">{err.email}</p>
              )}
            </div>

            <div className="space-y-1">
              <Label htmlFor="password">Password</Label>
              <Input
                id="password"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••"
              />
              {err.password && (
                <p className="text-xs text-destructive">{err.password}</p>
              )}
            </div>

            {err.form && (
              <p className="rounded border border-destructive/30 bg-destructive/10 p-2 text-xs text-destructive">
                {err.form}
              </p>
            )}

            <Button
              type="submit"
              className="w-full"
              disabled={loading}
            >
              {loading ? "Signing in…" : "Login"}
            </Button>

            <p className="text-center text-sm text-muted-foreground">
              No account?{" "}
              <Link
                to="/register"
                className="font-medium text-primary hover:underline"
              >
                Register
              </Link>
            </p>

            <p className="text-center text-xs text-muted-foreground">
              Demo: any email + password (min 4 chars)
            </p>
          </form>
        </CardContent>
      </Card>
    </div>
  </div>
);
}