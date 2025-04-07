"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAppSelector } from "@/redux/hooks";

export default function RequireAdmin({
  children,
}: {
  children: React.ReactNode;
}) {
  const router = useRouter();
  const { isAuthenticated, token, roles } = useAppSelector(
    (state) => state.auth
  );

  useEffect(() => {
    if (!isAuthenticated || !token || !roles.includes("admin")) {
      router.replace("/"); // o redirige a /dashboard
    }
  }, [isAuthenticated, token, roles, router]);

  if (!isAuthenticated || !token || !roles.includes("admin")) return null;

  return <>{children}</>;
}
