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

export const Route = createFileRoute("/register")({
  ssr: false,
  component: RegisterPage,
});

function RegisterPage() {
  const { register } = useAuth();
  const nav = useNavigate();
  const [f, setF] = useState({ username: "", email: "", password: "", confirm: "" });
  const [err, setErr] = useState<Record<string, string>>({});
  const [loading, setLoading] = useState(false);

  const set = (k: keyof typeof f) => (e: React.ChangeEvent<HTMLInputElement>) =>
    setF((s) => ({ ...s, [k]: e.target.value }));

  const submit = async (e: FormEvent) => {
    e.preventDefault();
    const errs: Record<string, string> = {};
    if (!f.username) errs.username = "Username is required";
    if (!/^\S+@\S+\.\S+$/.test(f.email)) errs.email = "Valid email required";
    if (f.password.length < 6) errs.password = "Min 6 characters";
    if (f.password !== f.confirm) errs.confirm = "Passwords do not match";
    setErr(errs);
    if (Object.keys(errs).length) return;
    setLoading(true);
    try {
      await register(f.username, f.email, f.password);
      toast.success("Account created — please log in");
      nav({ to: "/login" });
    } catch (e: any) {
      toast.error(e.message || "Registration failed");
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
        src="https://images.unsplash.com/photo-1507842217343-583bb7270b66?auto=format&fit=crop&w=1200&q=80"
        alt="Library"
        className="h-full w-full object-cover"
      />

      {/* Overlay */}
      <div className="absolute inset-0 bg-black/50" />

      {/* Content */}
      <div className="absolute inset-0 flex flex-col justify-center items-center text-white">
        <Library className="h-16 w-16 mb-6" />

        <h1 className="text-5xl font-bold">
          SecureLib
        </h1>

        <p className="mt-4 max-w-md text-center text-lg">
          Join SecureLib and create your administrator account to efficiently
          manage books, members, borrowing records, and library operations from
          one secure and modern platform.
        </p>
      </div>
    </motion.div>

    {/* Right Side */}
    <motion.div
      initial={{ x: 150, opacity: 0 }}
      animate={{ x: 0, opacity: 1 }}
      transition={{ duration: 0.8 }}
      className="flex items-center justify-center bg-muted/40 px-6"
    >
      <Card className="w-full max-w-md shadow-lg">
        <CardHeader className="items-center text-center">
          <div className="flex items-center gap-2 text-2xl font-semibold">
            <Library className="text-primary" />
            SecureLib
          </div>

          <p className="mt-1 text-sm text-muted-foreground">
            Create your admin account
          </p>
        </CardHeader>

        <CardContent>
          <form onSubmit={submit} className="space-y-4" noValidate>
            {(["username", "email", "password", "confirm"] as const).map(
              (k) => (
                <div key={k} className="space-y-1">
                  <Label htmlFor={k} className="capitalize">
                    {k === "confirm" ? "Confirm Password" : k}
                  </Label>

                  <Input
                    id={k}
                    type={
                      k === "email"
                        ? "email"
                        : k === "password" || k === "confirm"
                        ? "password"
                        : "text"
                    }
                    value={f[k]}
                    onChange={set(k)}
                    placeholder={
                      k === "username"
                        ? "Enter username"
                        : k === "email"
                        ? "admin@example.com"
                        : k === "password"
                        ? "Enter password"
                        : "Confirm password"
                    }
                  />

                  {err[k] && (
                    <p className="text-xs text-destructive">
                      {err[k]}
                    </p>
                  )}
                </div>
              )
            )}

            <Button
              type="submit"
              className="w-full"
              disabled={loading}
            >
              {loading ? "Creating..." : "Register"}
            </Button>

            <p className="text-center text-sm text-muted-foreground">
              Already have an account?{" "}
              <Link
                to="/login"
                className="font-medium text-primary hover:underline"
              >
                Login
              </Link>
            </p>
          </form>
        </CardContent>
      </Card>
    </motion.div>
  </div>
);
}
