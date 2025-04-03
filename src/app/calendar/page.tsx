// calendar/page.tsx
"use client";

import { useState } from "react";
import { useSelector } from "react-redux";
import useCalendarData from "@/hooks/useCalendarData";
import useFilteredEvents from "@/hooks/useFilteredEvents";
import CalendarEventForm from "@/components/calendar/CalendarEventForm";
import { format } from "date-fns";

export default function CalendarPage() {
  useCalendarData();

  const [filterCategory, setFilterCategory] = useState("");
  const [filterChild, setFilterChild] = useState("");
  const [filterDate, setFilterDate] = useState("");

  const categories = useSelector((state: any) => state.calendar.categories);
  const children = useSelector((state: any) => state.calendar.children);
  const filteredEvents = useFilteredEvents({
    filterCategory,
    filterChild,
    filterDate,
  });

  return (
    <main className="container">
      <h1 className="heading-xl mb-4">🗓️ Calendario familiar</h1>

      {/* Filtros */}
      <div className="filters mb-4 flex gap-2">
        <select
          value={filterCategory}
          onChange={(e) => setFilterCategory(e.target.value)}
          className="input"
        >
          <option value="">Todas las categorías</option>
          {categories.map((c: any) => (
            <option key={c.id} value={c.id}>
              {c.name}
            </option>
          ))}
        </select>

        <select
          value={filterChild}
          onChange={(e) => setFilterChild(e.target.value)}
          className="input"
        >
          <option value="">Todos los hijos</option>
          {children.map((c: any) => (
            <option key={c.id} value={c.id}>
              {c.firstName}
            </option>
          ))}
        </select>

        <input
          type="date"
          value={filterDate}
          onChange={(e) => setFilterDate(e.target.value)}
          className="input"
        />
      </div>

      {/* Tabla de eventos */}
      <table className="w-full border-collapse">
        <thead>
          <tr className="bg-gray-200">
            <th>Título</th>
            <th>Hijos</th>
            <th>Categoría</th>
            <th>Inicio</th>
            <th>Fin</th>
          </tr>
        </thead>
        <tbody>
          {filteredEvents.map((event: any) => (
            <tr key={event.id} className="border-b">
              <td>{event.title}</td>
              <td>
                {event.children && event.children.length > 0
                  ? event.children
                      .map((c: any) => c.child?.firstName)
                      .join(", ")
                  : "—"}
              </td>
              <td>{event.category?.name || "—"}</td>
              <td>{format(new Date(event.start), "dd/MM/yyyy HH:mm")}</td>
              <td>{format(new Date(event.end), "dd/MM/yyyy HH:mm")}</td>
            </tr>
          ))}
        </tbody>
      </table>

      {/* Formulario */}
      <div className="mt-8">
        <CalendarEventForm
          categories={categories}
          children={children}
          onEventCreated={() => {
            useCalendarData(); // recarga los datos tras crear evento
          }}
        />
      </div>
    </main>
  );
}
