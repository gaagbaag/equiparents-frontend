"use client";

import { useEffect, useState } from "react";
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
  const { loading } = useCheckSession(); // Carga la sesión del backend
  const { isAuthenticated, token, user, roles } = useAppSelector(
    (state) => state.auth
  );

  const [sessionVerified, setSessionVerified] = useState(false);

  const isValidSession = !!token && !!user && isAuthenticated;

  // Verificamos si el usuario tiene alguno de los roles permitidos
  const hasValidRole =
    !allowedRoles || allowedRoles.some((role) => roles.includes(role));

  // Esperamos a que useCheckSession() termine (loading === false)
  // para marcar que la sesión ha sido verificada
  useEffect(() => {
    if (!loading) {
      setSessionVerified(true);
    }
  }, [loading]);

  // Una vez verificada la sesión, revisamos el rol y la cuenta parental
  useEffect(() => {
    // Evitamos redirigir mientras no esté verificada la sesión
    if (!sessionVerified) return;

    // 1) Si no hay sesión válida o rol no válido => login
    if (!isValidSession || !hasValidRole) {
      console.warn("🔐 Acceso denegado. Redirigiendo a login...");
      router.replace("/api/auth/login");
      return;
    }

    // 2) Si es un padre sin parentalAccountId => onboarding
    //    Pero si user es admin, ignoramos esta regla.
    if (user && user.role === "parent" && !user.parentalAccountId) {
      console.warn("⚠️ Padre sin cuenta parental => /onboarding/profile");
      router.replace("/onboarding/profile");
      return;
    }
  }, [sessionVerified, isValidSession, hasValidRole, user, router]);

  // Mientras loading o la sesión aún no está verificada, mostramos "Cargando..."
  if (loading || !sessionVerified) {
    return <p className="p-4">Cargando sesión...</p>;
  }

  // Si ya verificamos sesión y no cumple => nada
  if (!isValidSession || !hasValidRole) {
    return null;
  }

  // Si es padre sin cuenta parental, igual devolvemos null
  // (aunque ya habría redireccionado en useEffect).
  if (user?.role === "parent" && !user?.parentalAccountId) {
    return null;
  }

  // Caso ideal: usuario con rol válido y (si es parent) cuenta parental
  return <>{children}</>;
}
