// src/app/(app)/calendar/event/[id]/edit/page.tsx
"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { useAppDispatch, useAppSelector } from "@/redux/hooks";
import { fetchCalendarData } from "@/redux/thunks/calendar/calendarThunks";
import CalendarEventForm from "@/components/calendar/CalendarEventForm";
import type { CalendarEvent, ParentRef } from "@/types/calendar";

export default function EditEventPage() {
  const { id } = useParams() as { id: string };
  const router = useRouter();
  const dispatch = useAppDispatch();

  const events = useAppSelector((state) => state.calendar.events);
  const event = events.find((e) => e.id === id) || null;
  const categories = useAppSelector((state) => state.calendar.categories);
  const children = useAppSelector((state) => state.calendar.children);
  const tags = useAppSelector((state) => state.calendar.tags);
  const rawParents = useAppSelector((state) => state.calendar.parents);

  const [initialData, setInitialData] = useState<CalendarEvent | null>(null);

  useEffect(() => {
    if (!events.length) dispatch(fetchCalendarData());
  }, [dispatch, events.length]);

  useEffect(() => {
    if (event) setInitialData(event);
  }, [event]);

  const parents: ParentRef[] = rawParents
    .filter((p) => p.id && p.firstName)
    .map((p) => ({ id: p.id!, firstName: p.firstName! }));

  if (!initialData) return <p className="p-4">⏳ Cargando evento...</p>;

  return (
    <main className="container max-w-3xl mx-auto">
      <h1 className="heading-xl mb-6">✏️ Editar evento</h1>
      <CalendarEventForm
        initialData={initialData}
        categories={categories}
        children={children}
        tags={tags}
        parents={parents}
        onEventCreated={() => router.push("/calendar")}
      />
    </main>
  );
}
