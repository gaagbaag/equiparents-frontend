"use client";

import { useState, useEffect } from "react";
import { format } from "date-fns";
import { es } from "date-fns/locale";

interface EventItem {
  id: string;
  title: string;
  start: string;
  end: string;
  status: string;
  children?: { child: { firstName: string } }[];
}

export default function UpcomingEventsSummary() {
  const [events, setEvents] = useState<EventItem[]>([]);

  useEffect(() => {
    const fetchEvents = async () => {
      try {
        const tokenRes = await fetch("/api/auth/token");
        const { accessToken } = await tokenRes.json();

        const res = await fetch(
          `${process.env.NEXT_PUBLIC_API_URL}/api/events`,
          {
            headers: { Authorization: `Bearer ${accessToken}` },
          }
        );

        if (res.ok) {
          const data = await res.json();
          const upcoming = data.events
            .filter((e: EventItem) => new Date(e.start) > new Date())
            .sort(
              (a: EventItem, b: EventItem) =>
                new Date(a.start).getTime() - new Date(b.start).getTime()
            )
            .slice(0, 5);

          setEvents(upcoming);
        }
      } catch (err) {
        console.error("❌ Error al obtener próximos eventos:", err);
      }
    };

    fetchEvents();
  }, []);

  if (events.length === 0) return null;

  return (
    <section className="mt-6">
      <h2 className="text-lg font-bold mb-2">📅 Próximas actividades</h2>
      <ul className="space-y-2">
        {events.map((event) => (
          <li
            key={event.id}
            className="p-3 border rounded-md bg-white shadow-sm"
          >
            <div className="font-medium text-blue-900">{event.title}</div>
            <div className="text-sm text-gray-700">
              {format(new Date(event.start), "PPPp", { locale: es })} →{" "}
              {format(new Date(event.end), "p", { locale: es })}
            </div>
            {event.children && event.children.length > 0 && (
              <div className="text-xs text-gray-500">
                👶 Participan:{" "}
                {event.children.map((c) => c.child.firstName).join(", ")}
              </div>
            )}
            <div className="text-xs text-gray-600 mt-1">
              ⏳ Estado: {event.status}
            </div>
          </li>
        ))}
      </ul>
    </section>
  );
}
