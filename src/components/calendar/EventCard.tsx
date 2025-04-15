// src/components/calendar/EventCard.tsx
"use client";

import { format } from "date-fns";
import { es } from "date-fns/locale";
import Link from "next/link";
import type { CalendarEvent } from "@/types/calendar";

type EventCardProps = {
  event: CalendarEvent;
  currentUserId: string;
};

export default function EventCard({ event, currentUserId }: EventCardProps) {
  const statusColorMap: Record<string, string> = {
    approved: "text-green-600 border-green-300 bg-green-50",
    pending: "text-yellow-700 border-yellow-300 bg-yellow-50",
    rejected: "text-red-600 border-red-300 bg-red-50",
  };

  const statusTextMap: Record<string, string> = {
    approved: "Aprobado",
    pending: "Pendiente",
    rejected: "Rechazado",
  };

  const colorClass = statusColorMap[event.status] || "text-gray-600";
  const statusLabel = statusTextMap[event.status] || "Desconocido";

  const createdByCurrentUser = event.createdBy?.id === currentUserId;

  return (
    <div className="border border-gray-300 rounded-lg p-4 shadow-sm bg-white">
      <div className="flex justify-between items-center mb-2">
        <h3 className="text-lg font-semibold">{event.title}</h3>
        {createdByCurrentUser && (
          <Link
            href={`/calendar/event/${event.id}/edit`}
            className="text-sm text-blue-600 hover:underline"
          >
            ✏️ Editar
          </Link>
        )}
      </div>

      {event.description && (
        <p className="text-sm text-gray-700 mb-2">{event.description}</p>
      )}

      {event.location && (
        <p className="text-sm text-gray-600 mb-2">📍 {event.location}</p>
      )}

      <p className="text-sm mb-1">
        🕓 {format(new Date(event.start), "dd/MM/yyyy HH:mm", { locale: es })} →{" "}
        {format(new Date(event.end), "HH:mm", { locale: es })}
      </p>

      {event.category && (
        <p className="text-sm text-gray-600 mb-1">
          📂 Categoría: <strong>{event.category.name}</strong>
        </p>
      )}

      {Array.isArray(event.tags) && event.tags.length > 0 && (
        <p className="text-sm mb-1">
          🏷️{" "}
          {event.tags.map((tag: { id: string; name: string }) => (
            <span
              key={tag.id}
              className="inline-block px-2 py-1 mr-1 text-xs bg-gray-200 text-gray-800 rounded"
            >
              {tag.name}
            </span>
          ))}
        </p>
      )}

      {Array.isArray(event.children) && event.children.length > 0 && (
        <p className="text-sm mb-1">
          👶{" "}
          {event.children
            .map(
              (c: { child: { id: string; firstName: string } }) =>
                c.child.firstName
            )
            .join(", ")}
        </p>
      )}

      {Array.isArray(event.parents) && event.parents.length > 0 && (
        <p className="text-sm mb-2">
          👨‍👩‍👧{" "}
          {event.parents
            .map((p: { user: { firstName: string } }) => p.user.firstName)
            .join(", ")}
        </p>
      )}

      <div className={`mt-2 text-xs border px-2 py-1 rounded ${colorClass}`}>
        Estado: <strong>{statusLabel}</strong>
      </div>

      {event.googleEventId && (
        <div className="mt-1 text-xs text-green-600">
          ✅ Sincronizado con Google
        </div>
      )}
    </div>
  );
}
