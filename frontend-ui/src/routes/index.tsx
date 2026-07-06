import { createFileRoute, redirect } from "@tanstack/react-router";
export const Route = createFileRoute("/")({
  ssr: false,
  beforeLoad: () => {
    if (typeof window === "undefined") return;
    const raw = window.localStorage.getItem("lms_user");
    throw redirect({ to: raw ? "/dashboard" : "/login" });
  },
  component: () => null,
});
