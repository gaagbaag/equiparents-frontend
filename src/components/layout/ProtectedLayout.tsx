// src/components/layout/ProtectedLayout.tsx
"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useAppSelector } from "@/redux/hooks";
import { useCheckSession } from "@/hooks/useCheckSession";

interface ProtectedLayoutProps {
  children: React.ReactNode;
  allowedRoles?: ("admin" | "parent")[];
}

export default function ProtectedLayout({
  children,
  allowedRoles,
}: ProtectedLayoutProps) {
  const router = useRouter();
  const { loading } = useCheckSession();
  const { isAuthenticated, token, user, roles } = useAppSelector(
    (state) => state.auth
  );

  const [sessionVerified, setSessionVerified] = useState(false);
  const [isWaitingForRedux, setIsWaitingForRedux] = useState(true);

  const isValidSession = !!token && !!user && isAuthenticated;
  const hasValidRole =
    !!roles?.length &&
    (!allowedRoles || allowedRoles.some((role) => roles.includes(role)));

  const userReady =
    user &&
    typeof user.role === "string" &&
    (user.role !== "parent" || user.parentalAccountId !== null);

  useEffect(() => {
    if (!loading) {
      setSessionVerified(true);
    }
  }, [loading]);

  useEffect(() => {
    if (!sessionVerified) return;

    const timeout = setTimeout(() => {
      setIsWaitingForRedux(false);
    }, 1500); // ⏳ Más margen para Redux

    return () => clearTimeout(timeout);
  }, [sessionVerified]);

  useEffect(() => {
    if (!sessionVerified || isWaitingForRedux || !userReady) return;

    console.log("🔎 [ProtectedLayout] Estado de sesión:", {
      isAuthenticated,
      token,
      roles,
      user,
      hasValidRole,
    });

    if (!isValidSession || !hasValidRole) {
      console.warn("🔐 Sesión no válida o sin rol permitido.");
      return;
    }

    if (user?.role === "parent" && !user.parentalAccountId) {
      console.warn(
        "⚠️ Padre sin cuenta parental. Redirigiendo a /onboarding/family..."
      );
      router.replace("/onboarding/family");
    }
  }, [
    sessionVerified,
    isWaitingForRedux,
    isValidSession,
    hasValidRole,
    userReady,
    user,
    router,
  ]);

  if (loading || !sessionVerified || isWaitingForRedux || !userReady) {
    return <p className="p-4 text-gray-600">⏳ Cargando sesión...</p>;
  }

  if (!isValidSession) {
    return (
      <div className="p-4 text-red-600">
        ❌ Sesión no válida. No hay token, usuario o estado autenticado.
        <br />
        <button
          onClick={() => location.reload()}
          className="mt-2 underline text-sm text-blue-600"
        >
          Reintentar
        </button>
      </div>
    );
  }

  if (!hasValidRole) {
    return (
      <div className="p-4 text-orange-600">
        🚫 No tienes permisos suficientes para ver este contenido.
      </div>
    );
  }

  if (user?.role === "parent" && !user?.parentalAccountId) {
    return (
      <div className="p-4 text-orange-500">
        ⚠️ Aún no has completado el registro familiar. Serás redirigido...
      </div>
    );
  }

  return <>{children}</>;
}
