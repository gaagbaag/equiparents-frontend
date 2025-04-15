"use client";

import { useState, useEffect } from "react";
import { useAppDispatch, useAppSelector } from "@/redux/hooks";
import { fetchCalendarData } from "@/redux/thunks/calendar/calendarThunks";
import useFilteredEvents from "@/hooks/useFilteredEvents";
import CalendarEventForm from "@/components/calendar/CalendarEventForm";
import GoogleCalendarSync from "@/components/calendar/GoogleCalendarSync";
import GoogleSyncStatus from "@/components/calendar/GoogleSyncStatus";
import EventTable from "@/components/calendar/EventTable";
import { ParentRef } from "@/types/calendar";

export default function CalendarPage() {
  const dispatch = useAppDispatch();

  useEffect(() => {
    dispatch(fetchCalendarData());
  }, [dispatch]);

  const [filterCategory, setFilterCategory] = useState("");
  const [filterChild, setFilterChild] = useState("");
  const [filterDate, setFilterDate] = useState("");
  const [showForm, setShowForm] = useState(false);

  const categories = useAppSelector((state) => state.calendar.categories);
  const children = useAppSelector((state) => state.calendar.children);
  const tags = useAppSelector((state) => state.calendar.tags);
  const parents = useAppSelector((state) => state.calendar.parents);
  const loading = useAppSelector((state) => state.calendar.loading);
  const error = useAppSelector((state) => state.calendar.error);

  const filteredEvents = useFilteredEvents({
    filterCategory,
    filterChild,
    filterDate,
  });

  const safeParents: ParentRef[] = parents
    .filter((p) => p.id && p.firstName)
    .map((p) => ({ id: p.id!, firstName: p.firstName! }));

  return (
    <main className="container">
      <h1 className="heading-xl mb-4">🗓️ Calendario familiar</h1>

      <GoogleCalendarSync />
      <GoogleSyncStatus />

      {/* Filtros */}
      <div className="filters mb-4 flex flex-wrap gap-2">
        <select
          value={filterCategory}
          onChange={(e) => setFilterCategory(e.target.value)}
          className="input"
        >
          <option value="">Todas las categorías</option>
          {categories.map((c) => (
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
          {children.map((c) => (
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
      <EventTable events={filteredEvents} loading={loading} error={error} />

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
            parents={safeParents}
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
