import { useEffect, useState } from "react";
import { useDispatch } from "react-redux";
import { setUser } from "@/redux/slices/authSlice";
import { logFetchError } from "@/utils/logFetchError";

export default function useSyncUserWithBackend(): { isSyncing: boolean } {
  const dispatch = useDispatch();
  const [isSyncing, setIsSyncing] = useState(true);

  useEffect(() => {
    const syncUser = async () => {
      try {
        console.log("🔄 Iniciando sincronización con backend...");
        const sessionRes = await fetch(
          `${process.env.NEXT_PUBLIC_API_URL}/api/session`,
          {
            credentials: "include",
          }
        );
        if (!sessionRes.ok) {
          console.warn("⚠️ No se encontró sesión");
          setIsSyncing(false);
          return;
        }

        const { user, accessToken, roles } = await sessionRes.json();

        // Aseguramos que parentalAccountId esté disponible desde claims personalizados
        const parentalAccountId =
          user["https://equiparents.api/parentalAccountId"] || null;

        const userWithAccount = {
          ...user,
          parentalAccountId,
        };

        dispatch(
          setUser({
            user: userWithAccount,
            token: accessToken,
            roles,
          })
        );
      } catch (error: unknown) {
        if (error instanceof Error) {
          logFetchError(error, "Error de sincronización del usuario");
        } else {
          console.error(
            "❌ Error inesperado en sincronización post-login:",
            error
          );
        }
      } finally {
        setIsSyncing(false);
      }
    };

    syncUser();
  }, [dispatch]);

  return { isSyncing };
}
