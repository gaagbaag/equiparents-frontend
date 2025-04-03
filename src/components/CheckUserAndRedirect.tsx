"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import SyncStatusPanel from "@/components/SyncStatusPanel";

export default function CheckUserAndRedirect({
  fallback,
}: {
  fallback?: React.ReactNode;
}) {
  const router = useRouter();
  const [error, setError] = useState<string | null>(null);
  const [isSyncing, setIsSyncing] = useState(true);
  const [syncError, setSyncError] = useState<string | null>(null);

  useEffect(() => {
    const redirectByRole = async () => {
      try {
        const tokenRes = await fetch("/api/auth/token");
        const { accessToken } = await tokenRes.json();

        if (!accessToken) {
          throw new Error("Token no disponible");
        }

        const userRes = await fetch(
          `${process.env.NEXT_PUBLIC_API_URL}/api/users/me`,
          {
            headers: {
              Authorization: `Bearer ${accessToken}`,
            },
          }
        );

        if (!userRes.ok) {
          if (userRes.status === 404) {
            setError("Tu usuario aún no está registrado en el sistema.");
            setSyncError("Usuario no encontrado");
          } else {
            throw new Error("No se pudo obtener el rol del usuario");
          }
          return;
        }

        const user = await userRes.json();

        if (user.role === "admin") {
          router.replace("/admin/dashboard");
        } else {
          router.replace("/dashboard/parent");
        }
      } catch (err) {
        console.error("❌ Error redirigiendo:", err);
        setSyncError("Error inesperado en la sincronización");
        setError("Ocurrió un problema al sincronizar tu cuenta.");
      } finally {
        setIsSyncing(false);
      }
    };

    redirectByRole();
  }, [router]);

  if (error) {
    return (
      <>
        <SyncStatusPanel isSyncing={isSyncing} error={syncError} />
        <div className="container page-center">
          <h2 className="text-xl font-semibold mb-2">⚠️ Error</h2>
          <p className="text-red-600">{error}</p>
          <p className="text-gray-500 text-sm mt-2">
            Puedes reintentar la sincronización a continuación.
          </p>
        </div>
      </>
    );
  }

  return fallback || <SyncStatusPanel isSyncing={isSyncing} />;
}
