import { useState, type ReactNode } from "react";
import { Link, useNavigate, useRouterState } from "@tanstack/react-router";
import * as Icons from "lucide-react";
import { useAuth } from "@/lib/auth";
import { Button } from "@/components/ui/button";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { cn } from "@/lib/utils";

const nav = [
  { to: "/dashboard", label: "Dashboard", icon: Icons.LayoutDashboard },
  { to: "/authors", label: "Authors", icon: Icons.Users },
  { to: "/books", label: "Books", icon: Icons.BookOpen },
  { to: "/upload", label: "Upload Image", icon: Icons.Upload },
  { to: "/profile", label: "Profile", icon: Icons.User },
] as const;

export function DashboardLayout({ children }: { children: ReactNode }) {
  const { user, logout } = useAuth();
  const nav_ = useNavigate();
  const pathname = useRouterState({ select: (s) => s.location.pathname });
  const [open, setOpen] = useState(false);
  const [confirm, setConfirm] = useState(false);

  const doLogout = () => {
    logout();
    nav_({ to: "/login" });
  };

  return (
    <div className="min-h-screen bg-muted/30">
      {/* Topbar */}
      <header className="sticky top-0 z-40 flex h-14 items-center justify-between border-b bg-background px-4 shadow-sm">
        <div className="flex items-center gap-3">
          <button
            className="rounded p-2 hover:bg-accent md:hidden"
            onClick={() => setOpen((o) => !o)}
            aria-label="Toggle menu"
          >
            {open ? <Icons.X size={18} /> : <Icons.Menu size={18} />}
          </button>
          <div className="flex items-center gap-2 font-semibold">
            <Icons.Library className="text-primary" size={22} />
            <span>SecureLib</span>
          </div>
        </div>
        <div className="flex items-center gap-3">
          <span className="hidden text-sm text-muted-foreground sm:inline">
            {user?.username}
          </span>
          <Avatar className="h-8 w-8">
            <AvatarFallback>{user?.username?.[0]?.toUpperCase() ?? "U"}</AvatarFallback>
          </Avatar>
          <Button variant="outline" size="sm" onClick={() => setConfirm(true)}>
            <Icons.LogOut size={14} /> Logout
          </Button>
        </div>
      </header>

      <div className="flex">
        {/* Sidebar */}
        <aside
          className={cn(
            "fixed inset-y-0 left-0 top-14 z-30 w-60 border-r bg-background transition-transform md:sticky md:top-14 md:h-[calc(100vh-3.5rem)] md:translate-x-0",
            open ? "translate-x-0" : "-translate-x-full",
          )}
        >
          <nav className="flex flex-col gap-1 p-3">
            {nav.map((item) => {
              const active = pathname === item.to;
              const Icon = item.icon;
              return (
                <Link
                  key={item.to}
                  to={item.to}
                  onClick={() => setOpen(false)}
                  className={cn(
                    "flex items-center gap-3 rounded-md px-3 py-2 text-sm transition-colors",
                    active
                      ? "bg-primary text-primary-foreground"
                      : "text-foreground hover:bg-accent",
                  )}
                >
                  <Icon size={16} />
                  {item.label}
                </Link>
              );
            })}
            <button
              onClick={() => setConfirm(true)}
              className="mt-2 flex items-center gap-3 rounded-md px-3 py-2 text-sm text-foreground hover:bg-accent"
            >
              <Icons.LogOut size={16} /> Logout
            </button>
          </nav>
        </aside>

        {/* Main */}
        <main className="min-h-[calc(100vh-3.5rem)] flex-1 p-4 md:p-6">
          <div className="mx-auto max-w-6xl">{children}</div>
          <footer className="mx-auto mt-8 max-w-6xl border-t pt-4 text-center text-xs text-muted-foreground">
            SecureLib Admin © {new Date().getFullYear()}
          </footer>
        </main>
      </div>

      <AlertDialog open={confirm} onOpenChange={setConfirm}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Log out?</AlertDialogTitle>
            <AlertDialogDescription>
              You will be returned to the login page and your session will be cleared.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction onClick={doLogout}>Log out</AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}