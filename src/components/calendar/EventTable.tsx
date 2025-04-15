// src/components/calendar/EventTable.tsx
import type { CalendarEvent } from "@/types/calendar";

interface Props {
  events: CalendarEvent[];
  loading: boolean;
  error: string | null;
}

export default function EventTable({ events, loading, error }: Props) {
  if (loading) return <p className="p-4">Cargando eventos...</p>;
  if (error) return <p className="text-red-600 p-4">❌ {error}</p>;
  if (events.length === 0)
    return <p className="p-4">No hay eventos que coincidan con los filtros.</p>;

  return (
    <table className="w-full border-collapse text-sm">
      <thead>
        <tr className="bg-gray-200 text-left">
          <th className="p-2">Título</th>
          <th className="p-2">Hijos</th>
          <th className="p-2">Categoría</th>
          <th className="p-2">Estado</th>
          <th className="p-2">Inicio</th>
          <th className="p-2">Fin</th>
          <th className="p-2">Google</th>
          <th className="p-2">Acciones</th>
        </tr>
      </thead>
      <tbody>
        {events.map((event) => (
          <tr key={event.id} className="border-b">
            <td className="p-2 font-medium">{event.title}</td>
            <td className="p-2">
              {event.children?.length
                ? event.children.map((c) => c.child.firstName).join(", ")
                : "—"}
            </td>
            <td className="p-2">{event.category?.name || "—"}</td>
            <td className="p-2">
              {
                {
                  approved: "✅ Aprobado",
                  pending: "🕒 Pendiente",
                  rejected: "❌ Rechazado",
                }[event.status || "pending"]
              }
            </td>
            <td className="p-2">
              {new Date(event.start).toLocaleString("es-CL", {
                dateStyle: "short",
                timeStyle: "short",
              })}
            </td>
            <td className="p-2">
              {new Date(event.end).toLocaleString("es-CL", {
                dateStyle: "short",
                timeStyle: "short",
              })}
            </td>
            <td className="p-2">
              {event.googleEventId ? (
                <a
                  href={`https://calendar.google.com/calendar/u/0/r/eventedit/${event.googleEventId}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-blue-600 underline"
                >
                  Ver
                </a>
              ) : (
                "—"
              )}
            </td>
            <td className="p-2">
              <a
                href={`/calendar/event/${event.id}`}
                className="text-sm text-indigo-600 hover:underline"
              >
                Editar
              </a>
            </td>
          </tr>
        ))}
      </tbody>
    </table>
  );
}
