import { useEffect, useState } from "react";
import { logFetchError } from "@/utils/logFetchError";

/**
 * Hook que sincroniza automáticamente el usuario autenticado con el backend
 * Llama a /api/session y luego a /api/auth/post-login si es necesario
 */
export default function useSyncUserWithBackend(): { isSyncing: boolean } {
  const [isSyncing, setIsSyncing] = useState(true);

  useEffect(() => {
    const syncUser = async () => {
      try {
        console.log("🔄 Iniciando sincronización con backend...");

        const sessionRes = await fetch("/api/session");
        const { user, token } = await sessionRes.json();

        if (!user?.sub || !token) {
          console.warn("⚠️ Usuario o token no encontrados en sesión");
          setIsSyncing(false);
          return;
        }

        console.log("📡 GET /api/users/me");
        const userRes = await fetch(
          `${process.env.NEXT_PUBLIC_API_URL}/api/users/me`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );

        if (userRes.status === 404) {
          console.log("🆕 Usuario no existe. Enviando a /post-login...");

          const postRes = await fetch(
            `${process.env.NEXT_PUBLIC_API_URL}/api/auth/post-login`,
            {
              method: "POST",
              headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${token}`,
              },
            }
          );

          const postData = await postRes.json();
          if (!postRes.ok) {
            console.error("❌ Error en post-login:", postData);
          } else {
            console.log("✅ Usuario sincronizado:", postData);
          }
        } else if (userRes.ok) {
          console.log("✅ Usuario ya sincronizado");
        } else {
          console.error("❌ Error al verificar usuario:", await userRes.text());
        }
      } catch (error) {
        logFetchError(error, "Sincronización post-login");
      } finally {
        setIsSyncing(false);
      }
    };

    syncUser();
  }, []);

  return { isSyncing };
}
