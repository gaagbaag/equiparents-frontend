// src/components/calendar/GoogleSyncStatus.tsx
"use client";

import { useAppSelector } from "@/redux/hooks";

export default function GoogleSyncStatus() {
  const user = useAppSelector((state) => state.auth.user);
  const hasToken = Boolean(user?.googleRefreshToken);
  const hasCalendar = Boolean(user?.googleCalendarId);
  const calendarId = user?.googleCalendarId;

  const handleSyncClick = async () => {
    try {
      // ✅ Obtener token real desde Auth0
      const resToken = await fetch("/api/auth/token");
      const { accessToken } = await resToken.json();

      const response = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/api/calendar/sync-events-to-google`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${accessToken}`, // ✅ Este sí es un JWT válido
          },
        }
      );

      if (response.ok) {
        console.log("✅ Eventos sincronizados con Google Calendar");
      } else {
        const err = await response.json();
        console.error("❌ Error al sincronizar:", err.message);
      }
    } catch (error) {
      console.error("❌ Error general:", error);
    }
  };

  if (!hasToken && !hasCalendar) return null;

  return (
    <div className="mb-4 p-4 border border-green-300 bg-green-50 rounded-lg shadow-sm text-green-900">
      <h2 className="font-semibold mb-1">🔗 Estado de Google Calendar</h2>
      {hasToken && hasCalendar ? (
        <>
          <p className="text-sm mb-2">
            ✅ Tu cuenta está vinculada con Google Calendar.
          </p>

          <div className="flex gap-2">
            <a
              href={`https://calendar.google.com/calendar/u/0/r?cid=${encodeURIComponent(
                calendarId!
              )}`}
              target="_blank"
              rel="noopener noreferrer"
              className="button button-secondary"
            >
              Abrir en Google Calendar
            </a>
            <button onClick={handleSyncClick} className="button button-primary">
              Sincronizar eventos
            </button>
          </div>

          <p className="text-xs mt-2 text-gray-600 break-all">
            ID: <code>{calendarId}</code>
          </p>
        </>
      ) : (
        <p className="text-yellow-700">
          ⚠️ Cuenta de Google conectada, pero sin calendario seleccionado.
        </p>
      )}
    </div>
  );
}
