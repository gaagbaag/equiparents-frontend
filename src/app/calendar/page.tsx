"use client";
import { useState, useEffect } from "react";
import { useAppDispatch, useAppSelector } from "@/redux/hooks";
import { fetchCalendarData } from "@/redux/thunks/calendar/calendarThunks";
import useFilteredEvents from "@/hooks/useFilteredEvents";
import CalendarEventForm from "@/components/calendar/CalendarEventForm";
import { format } from "date-fns";
import type { CalendarCategory, Child, CalendarEvent } from "@/types/calendar";

export default function CalendarPage() {
  const dispatch = useAppDispatch();

  useEffect(() => {
    dispatch(fetchCalendarData());
  }, [dispatch]);

  const [filterCategory, setFilterCategory] = useState("");
  const [filterChild, setFilterChild] = useState("");
  const [filterDate, setFilterDate] = useState("");
  const [showForm, setShowForm] = useState(false);

  const categories = useAppSelector((state) => state.calendar.categories) || [];
  const children = useAppSelector((state) => state.calendar.children) || [];
  const tags = useAppSelector((state) => state.calendar.tags) || [];
  // Supongamos que en tu slice de calendar agregaste una propiedad "parents".
  // Si no la tienes, envía un array vacío.
  const parents = useAppSelector((state) => state.calendar.parents) || [];
  const loading = useAppSelector((state) => state.calendar.loading);
  const error = useAppSelector((state) => state.calendar.error);

  const filteredEvents = useFilteredEvents({
    filterCategory,
    filterChild,
    filterDate,
  });

  return (
    <main className="container">
      <h1 className="heading-xl mb-4">🗓️ Calendario familiar</h1>

      {/* Filtros */}
      <div className="filters mb-4 flex flex-wrap gap-2">
        <select
          value={filterCategory}
          onChange={(e) => setFilterCategory(e.target.value)}
          className="input"
        >
          <option value="">Todas las categorías</option>
          {Array.isArray(categories) &&
            categories.map((c: CalendarCategory) => (
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
          {Array.isArray(children) &&
            children.map((c: Child) => (
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
      {loading ? (
        <p>Cargando eventos...</p>
      ) : error ? (
        <p className="text-red-600">{error}</p>
      ) : filteredEvents.length === 0 ? (
        <p>No hay eventos que coincidan con los filtros seleccionados.</p>
      ) : (
        <table className="w-full border-collapse">
          <thead>
            <tr className="bg-gray-200 text-left">
              <th className="p-2">Título</th>
              <th className="p-2">Hijos</th>
              <th className="p-2">Categoría</th>
              <th className="p-2">Inicio</th>
              <th className="p-2">Fin</th>
            </tr>
          </thead>
          <tbody>
            {filteredEvents.map((event: CalendarEvent) => (
              <tr key={event.id} className="border-b">
                <td className="p-2">{event.title}</td>
                <td className="p-2">
                  {event.children?.length
                    ? event.children.map((c) => c.child?.firstName).join(", ")
                    : "—"}
                </td>
                <td className="p-2">{event.category?.name || "—"}</td>
                <td className="p-2">
                  {format(new Date(event.start), "dd/MM/yyyy HH:mm")}
                </td>
                <td className="p-2">
                  {format(new Date(event.end), "dd/MM/yyyy HH:mm")}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}

      {/* Botón para mostrar formulario */}
      <div className="mt-6 text-center">
        {!showForm && (
          <button
            onClick={() => setShowForm(true)}
            className="button button-primary"
          >
            ➕ Agregar nuevo evento
          </button>
        )}
      </div>

      {/* Formulario de nuevo evento */}
      {showForm && (
        <div className="mt-8">
          <CalendarEventForm
            categories={categories}
            children={children}
            tags={tags}
            parents={parents}
            onEventCreated={() => {
              dispatch(fetchCalendarData());
              setShowForm(false);
            }}
          />
        </div>
      )}
    </main>
  );
}
