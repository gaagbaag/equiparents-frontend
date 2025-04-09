"use client";

import { useEffect, useState } from "react";
import fetchWithToken from "@/utils/fetchWithToken";
import { useSearchParams, useRouter } from "next/navigation";

// ✅ Tipado del calendario de Google
interface GoogleCalendar {
  id: string;
  summary: string;
  primary?: boolean;
}

export default function GoogleCalendarSync() {
  const [calendars, setCalendars] = useState<GoogleCalendar[]>([]);
  const [selected, setSelected] = useState<string>("");
  const [loading, setLoading] = useState(false);
  const [savingToken, setSavingToken] = useState(false);
  const [saved, setSaved] = useState(false);
  const [error, setError] = useState("");

  const searchParams = useSearchParams();
  const router = useRouter();

  useEffect(() => {
    if (!searchParams) return;
    const tokenParam = searchParams.get("token");
    if (tokenParam) {
      const refreshToken = decodeURIComponent(tokenParam);
      setSavingToken(true);
      fetchWithToken(
        `${process.env.NEXT_PUBLIC_API_URL}/api/google/oauth/save-token`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ refreshToken }),
        }
      )
        .then(async (res) => {
          if (!res.ok) {
            const data = await res.json();
            throw new Error(data.message || "Error al guardar token");
          }
          console.log("✅ Token guardado exitosamente desde callback");
          setSaved(true);
          setTimeout(() => router.replace("/calendar"), 1500);
        })
        .catch((err) => {
          console.error(
            "❌ Error al guardar token en frontend:",
            err.message,
            err.stack
          );
          if (err instanceof Error) {
            setError(err.message);
          } else {
            setError("Error desconocido al guardar token");
          }
        })
        .finally(() => {
          setSavingToken(false);
        });
    }
  }, [searchParams, router]);

  const handleConnect = () => {
    window.location.href = `${process.env.NEXT_PUBLIC_API_URL}/api/google/oauth/init`;
  };

  const loadCalendars = async () => {
    setLoading(true);
    setError("");
    try {
      const res = await fetchWithToken(
        `${process.env.NEXT_PUBLIC_API_URL}/api/google/calendar-list`
      );
      if (!res.ok) throw new Error("No se pudo cargar los calendarios");
      const data = await res.json();
      setCalendars(data.calendars || []);
    } catch (err) {
      setError("Error al obtener calendarios de Google");
    } finally {
      setLoading(false);
    }
  };

  const saveSelection = async () => {
    if (!selected) return;
    setLoading(true);
    setError("");
    try {
      const res = await fetchWithToken(
        `${process.env.NEXT_PUBLIC_API_URL}/api/google/calendar-select`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ calendarId: selected }),
        }
      );
      if (!res.ok) throw new Error("No se pudo guardar la selección");
      setSaved(true);
    } catch (err) {
      setError("Error al guardar selección de calendario");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="mb-8 bg-blue-50 p-4 rounded-lg">
      <h2 className="text-lg font-semibold mb-2">
        🔗 Sincronización con Google Calendar
      </h2>

      {savingToken && (
        <p className="text-sm text-blue-600 mb-3">
          Guardando token... Redirigiendo
        </p>
      )}

      <button className="button button-secondary mb-3" onClick={handleConnect}>
        Conectar mi cuenta de Google
      </button>

      <button
        className="button button-outline ml-2 mb-3"
        onClick={loadCalendars}
      >
        Ver mis calendarios disponibles
      </button>

      {loading && <p className="text-sm">Cargando...</p>}

      {calendars.length > 0 && (
        <div className="flex flex-col gap-2 mt-2">
          <select
            className="input"
            value={selected}
            onChange={(e) => setSelected(e.target.value)}
          >
            <option value="">Selecciona un calendario</option>
            {calendars.map((c) => (
              <option key={c.id} value={c.id}>
                {c.summary} {c.primary ? "(Principal)" : ""}
              </option>
            ))}
          </select>
          <button
            className="button button-primary mt-2"
            disabled={!selected}
            onClick={saveSelection}
          >
            Guardar selección
          </button>
        </div>
      )}

      {saved && (
        <p className="text-green-600 mt-2">
          ✅ Calendario vinculado correctamente
        </p>
      )}
      {error && <p className="text-red-600 mt-2">{error}</p>}
    </div>
  );
}
