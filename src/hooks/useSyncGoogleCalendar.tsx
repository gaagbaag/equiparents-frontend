"use client";

import { useEffect } from "react";
import { useAppDispatch, useAppSelector } from "@/redux/hooks";
import fetchWithToken from "@/utils/fetchWithToken";
import { setUser } from "@/redux/slices/authSlice";

/**
 * Hook que sincroniza automáticamente el calendario de Google
 * y guarda el calendarId si no ha sido guardado aún.
 */
export function useSyncGoogleCalendar() {
  const dispatch = useAppDispatch();
  const { user, token, roles } = useAppSelector((state) => state.auth);

  useEffect(() => {
    const sync = async () => {
      if (!user?.googleRefreshToken || user?.googleCalendarId) {
        console.log("🔄 Ya sincronizado o sin token. Omitido.");
        return;
      }

      try {
        console.log("📡 Consultando /google/calendar-list...");
        const res = await fetchWithToken(
          `${process.env.NEXT_PUBLIC_API_URL}/api/google/calendar-list`
        );

        const json = await res.json();
        const primary = json.calendars?.find((cal: any) => cal.primary);

        if (primary) {
          console.log("✅ Calendario principal detectado:", primary.id);

          const saveRes = await fetchWithToken(
            `${process.env.NEXT_PUBLIC_API_URL}/api/google/calendar-select`,
            {
              method: "POST",
              headers: { "Content-Type": "application/json" },
              body: JSON.stringify({ calendarId: primary.id }),
            }
          );

          if (!saveRes.ok) {
            const err = await saveRes.json();
            throw new Error(err.message || "Error al guardar calendarId");
          }

          // ⬇️ Actualizar Redux
          dispatch(
            setUser({
              user: {
                ...user,
                googleCalendarId: primary.id,
              },
              token,
              roles,
            })
          );

          console.log(
            "🧩 calendarId sincronizado y guardado en Redux:",
            primary.id
          );
        } else {
          console.warn("⚠️ No se encontró un calendario primario.");
        }
      } catch (err: any) {
        console.error("❌ Error al sincronizar calendario:", err.message);
      }
    };

    sync();
  }, [dispatch, user, token, roles]);
}
