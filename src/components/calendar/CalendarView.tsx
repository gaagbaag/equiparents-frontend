"use client";

import { useEffect, useState } from "react";
import { Calendar, dateFnsLocalizer } from "react-big-calendar";
import { format, parse, startOfWeek, getDay } from "date-fns";
import "react-big-calendar/lib/css/react-big-calendar.css";
import { es } from "date-fns/locale";

// 👇 si no has creado el archivo .d.ts
// TS pensará que esto no tiene tipos, pero lo permite compilar
// Alternativa: instala los tipos si quieres con: npm i -D @types/react-big-calendar

const locales = { es };

const localizer = dateFnsLocalizer({
  format,
  parse,
  startOfWeek: () => startOfWeek(new Date(), { weekStartsOn: 1 }),
  getDay,
  locales,
});

type Event = {
  id: string;
  title: string;
  start: Date;
  end: Date;
};

type Props = {
  categoryId?: string;
  childId?: string;
};

export default function CalendarView({ categoryId, childId }: Props) {
  const [events, setEvents] = useState<Event[]>([]);

  useEffect(() => {
    const fetchEvents = async () => {
      try {
        const tokenRes = await fetch("/api/auth/token");
        const { accessToken } = await tokenRes.json();

        const params = new URLSearchParams();
        if (categoryId) params.append("categoryId", categoryId);
        if (childId) params.append("childId", childId);

        const res = await fetch(
          `${process.env.NEXT_PUBLIC_API_URL}/api/events?${params}`,
          {
            headers: { Authorization: `Bearer ${accessToken}` },
          }
        );

        if (!res.ok) throw new Error("Error al obtener eventos");

        const data = await res.json();
        const parsed = data.events.map((event: any) => ({
          ...event,
          start: new Date(event.start),
          end: new Date(event.end),
        }));

        setEvents(parsed);
      } catch (error) {
        console.error("❌ Error al cargar eventos:", error);
      }
    };

    fetchEvents();
  }, [categoryId, childId]);

  return (
    <div style={{ marginTop: "2rem" }}>
      <Calendar
        localizer={localizer}
        events={events}
        startAccessor="start"
        endAccessor="end"
        titleAccessor="title"
        style={{ height: 600 }}
        defaultView="month"
        views={["month", "week", "day"]}
      />
    </div>
  );
}
