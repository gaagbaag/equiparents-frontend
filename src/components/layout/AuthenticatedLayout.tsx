"use client";

import { useCheckSession } from "@/hooks/useCheckSession";

export default function AuthenticatedLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const { loading } = useCheckSession();

  if (loading) return <p className="p-4">Cargando sesión...</p>;

  return <>{children}</>;
}
