"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAppSelector } from "@/redux/hooks";
import { useCheckSession } from "@/hooks/useCheckSession";

type ProtectedLayoutProps = {
  children: React.ReactNode;
  allowedRoles?: ("admin" | "parent")[];
};

export default function ProtectedLayout({
  children,
  allowedRoles,
}: ProtectedLayoutProps) {
  const router = useRouter();
  const { loading } = useCheckSession();
  const { isAuthenticated, token, user, roles } = useAppSelector(
    (state) => state.auth
  );

  const isValidSession = !!token && !!user && isAuthenticated;

  const hasValidRole =
    !allowedRoles || allowedRoles.some((role) => roles.includes(role));

  useEffect(() => {
    if (!loading && (!isValidSession || !hasValidRole)) {
      console.warn("🔐 Acceso denegado. Redirigiendo a login...");
      router.replace("/api/auth/login");
    }
  }, [loading, isValidSession, hasValidRole, router]);

  if (loading) return <p className="p-4">Cargando sesión...</p>;

  if (!isValidSession || !hasValidRole) return null;

  return <>{children}</>;
}
