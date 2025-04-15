"use client";

import { useAppSelector } from "@/redux/hooks";

export default function GoogleCalendarStatus() {
  const user = useAppSelector((state) => state.auth.user);
  const calendarId = user?.googleCalendarId;

  if (!calendarId) return null;

  const googleCalendarUrl = `https://calendar.google.com/calendar/u/0/r?cid=${encodeURIComponent(
    calendarId
  )}`;

  // Función para sincronizar los eventos con Google Calendar
  const handleSyncClick = async () => {
    try {
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/api/calendar/sync-events-to-google`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${user?.googleRefreshToken}`, // Usa el token de acceso si es necesario
          },
        }
      );

      if (response.ok) {
        console.log("Eventos sincronizados con Google Calendar");
      } else {
        console.error("Error al sincronizar eventos");
      }
    } catch (error) {
      console.error("Error de red o servidor:", error);
    }
  };

  return (
    <div className="mb-4 p-4 rounded-lg border border-green-300 bg-green-50 text-green-800 shadow-sm">
      <h2 className="font-semibold mb-1">✅ Google Calendar vinculado</h2>
      <p className="text-sm mb-2">
        Tu cuenta está sincronizada con Google Calendar.
      </p>
      <div className="flex gap-2">
        {/* Enlace para abrir el calendario en Google */}
        <a
          href={googleCalendarUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="inline-block text-sm px-4 py-2 rounded-md bg-green-600 text-white hover:bg-green-700 transition"
        >
          Abrir en Google Calendar
        </a>

        {/* Botón de sincronización */}
        <button
          onClick={handleSyncClick}
          className="inline-block text-sm px-4 py-2 rounded-md bg-blue-600 text-white hover:bg-blue-700 transition"
        >
          Sincronizar eventos
        </button>
      </div>
      <p className="text-xs mt-2 text-gray-600 break-all">
        ID del calendario: <code>{calendarId}</code>
      </p>
    </div>
  );
}
