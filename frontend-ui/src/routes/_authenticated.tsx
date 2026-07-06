import { createFileRoute, Outlet, redirect } from "@tanstack/react-router";
import { DashboardLayout } from "@/components/layout/DashboardLayout";

export const Route = createFileRoute("/_authenticated")({
  ssr: false,
  beforeLoad: () => {
    if (typeof window === "undefined") return;
    const raw = window.localStorage.getItem("lms_user");
    if (!raw) throw redirect({ to: "/login" });
  },
  component: () => (
    <DashboardLayout>
      <Outlet />
    </DashboardLayout>
  ),
});