import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useState } from "react";
import { LogOut, ShieldCheck } from "lucide-react";
import { useAuth } from "@/lib/auth";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
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

export const Route = createFileRoute("/_authenticated/profile")({
  component: ProfilePage,
});

function Row({ label, value }: { label: string; value: React.ReactNode }) {
  return (
    <div className="flex justify-between border-b py-3 text-sm last:border-0">
      <span className="text-muted-foreground">{label}</span>
      <span className="font-medium">{value}</span>
    </div>
  );
}

function ProfilePage() {
  const { user, logout } = useAuth();
  const nav = useNavigate();
  const [confirm, setConfirm] = useState(false);

  if (!user) return null;

  return (
    <div className="space-y-4">
      <h1 className="text-2xl font-semibold">Profile</h1>
      <Card>
        <CardHeader className="flex flex-row items-center gap-4">
          <Avatar className="h-14 w-14">
            <AvatarFallback className="text-lg">{user.username[0]?.toUpperCase()}</AvatarFallback>
          </Avatar>
          <div>
            <CardTitle>{user.username}</CardTitle>
            <p className="text-sm text-muted-foreground">{user.email}</p>
          </div>
        </CardHeader>
        <CardContent>
          <Row label="Username" value={user.username} />
          <Row label="Email" value={user.email} />
          <Row label="Role" value={<Badge>{user.role}</Badge>} />
          <Row label="Account Created" value={new Date(user.createdAt).toLocaleString()} />
          <Row
            label="JWT Status"
            value={
              <span className="inline-flex items-center gap-1 text-emerald-600">
                <ShieldCheck size={14} /> Active
              </span>
            }
          />
          <Row
            label="Token"
            value={<code className="max-w-[220px] truncate rounded bg-muted px-2 py-0.5 text-xs">{user.token}</code>}
          />
          <div className="mt-4">
            <Button variant="destructive" onClick={() => setConfirm(true)}>
              <LogOut size={14} /> Logout
            </Button>
          </div>
        </CardContent>
      </Card>

      <AlertDialog open={confirm} onOpenChange={setConfirm}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Log out?</AlertDialogTitle>
            <AlertDialogDescription>Your session will be cleared.</AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={() => {
                logout();
                nav({ to: "/login" });
              }}
            >
              Log out
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}