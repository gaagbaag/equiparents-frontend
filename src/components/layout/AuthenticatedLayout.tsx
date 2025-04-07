"use client";

import { useSelector } from "react-redux";
import { RootState } from "@/redux/store";
import { useCheckSession } from "@/hooks/useCheckSession";

export default function AuthenticatedLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const { loading } = useCheckSession();
  const isAuthenticated = useSelector(
    (state: RootState) => state.auth.isAuthenticated
  );

  if (loading) {
    return <p className="p-4">Cargando sesión...</p>;
  }

  if (!isAuthenticated) {
    console.warn("🔐 Usuario no autenticado en AuthenticatedLayout");
    return <p className="p-4 text-red-600">Sesión no válida</p>;
  }

  return <>{children}</>;
}
