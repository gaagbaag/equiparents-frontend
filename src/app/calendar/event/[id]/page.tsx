// app/calendar/event/[id]/page.tsx
import { format } from "date-fns";
import { notFound } from "next/navigation";
import { getEventById } from "@/services/calendarService.server";

interface Params {
  params: { id: string };
}

export default async function EventDetailPage({ params }: Params) {
  const event = await getEventById(params.id);

  if (!event) return notFound();

  return (
    <main className="container max-w-2xl">
      <h1 className="heading-xl mb-4">📌 Detalle del evento</h1>

      <div className="card p-4">
        <h2 className="heading-lg">{event.title}</h2>
        <p className="text-gray-700 mb-2">
          {event.description || "Sin descripción"}
        </p>

        <p>
          <strong>📅 Inicio:</strong>{" "}
          {format(new Date(event.start), "dd/MM/yyyy HH:mm")}
        </p>
        <p>
          <strong>🏁 Fin:</strong>{" "}
          {format(new Date(event.end), "dd/MM/yyyy HH:mm")}
        </p>
        <p>
          <strong>📍 Ubicación:</strong> {event.location || "—"}
        </p>
        <p>
          <strong>📂 Categoría:</strong> {event.category?.name || "—"}
        </p>
        <p>
          <strong>👶 Hijos participantes:</strong>
        </p>
        <ul className="list-disc ml-6">
          {event.children?.length ? (
            event.children.map((child) => (
              <li key={child.id}>{child.firstName}</li>
            ))
          ) : (
            <li>No hay hijos asignados</li>
          )}
        </ul>
      </div>
    </main>
  );
}
