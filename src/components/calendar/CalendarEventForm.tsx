"use client";

import { useState, useEffect } from "react";
import type { CalendarEvent } from "@/types/calendar";
import type { CalendarCategory, ParentRef } from "@/types/calendar";
import type { Tag } from "@/types/tag";
import type { Child } from "@/types/child";

export interface ReminderInput {
  type: "notification" | "email" | "sms";
  value: number;
  unit: "minutes" | "hours" | "days";
}

interface CalendarEventFormProps {
  initialData?: CalendarEvent;
  children: Child[];
  parents: ParentRef[];
  categories: CalendarCategory[];
  tags: Tag[];
  onEventCreated?: () => void;
}

const TIMEZONES = [
  "America/Santiago",
  "America/New_York",
  "Europe/London",
  "Europe/Madrid",
  "Asia/Tokyo",
  "Australia/Sydney",
];

const RECURRENCE_OPTIONS = [
  { label: "No repetir", value: "" },
  { label: "Diario", value: "FREQ=DAILY" },
  { label: "Semanal", value: "FREQ=WEEKLY" },
  { label: "Mensual", value: "FREQ=MONTHLY" },
  { label: "Anual", value: "FREQ=YEARLY" },
];

const REMINDER_UNITS = [
  { label: "Minutos", value: "minutes" },
  { label: "Horas", value: "hours" },
  { label: "Días", value: "days" },
];

export default function CalendarEventForm({
  initialData,
  children,
  parents = [],
  categories,
  tags,
  onEventCreated,
}: CalendarEventFormProps) {
  const [title, setTitle] = useState(initialData?.title || "");
  const [description, setDescription] = useState("");
  const [date, setDate] = useState("");
  const [time, setTime] = useState("");
  const [endDate, setEndDate] = useState("");
  const [endTime, setEndTime] = useState("");
  const [location, setLocation] = useState("");
  const [categoryId, setCategoryId] = useState("");
  const [childIds, setChildIds] = useState<string[]>([]);
  const [tagIds, setTagIds] = useState<string[]>([]);
  const [parentIds, setParentIds] = useState<string[]>([]);
  const [timezone, setTimezone] = useState("");
  const [recurrenceRule, setRecurrenceRule] = useState("");
  const [meetingLink, setMeetingLink] = useState("");
  const [reminders, setReminders] = useState<ReminderInput[]>([]);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);

  useEffect(() => {
    const localTZ = Intl.DateTimeFormat().resolvedOptions().timeZone;
    setTimezone(localTZ);
  }, []);

  useEffect(() => {
    if (initialData) {
      setDescription(initialData.description || "");
      setLocation(initialData.location || "");
      setCategoryId(initialData.category?.id || "");
      setChildIds(initialData.children?.map((c) => c.child.id) || []);
      setTagIds(initialData.tags?.map((t) => t.id) || []);
      setParentIds(initialData.parents?.map((p: any) => p.user.id) || []);
      setTimezone(initialData.timezone || "");
      setRecurrenceRule(initialData.recurrenceRule || "");
      setMeetingLink(initialData.meetingLink || "");
      setReminders(
        (initialData.reminders || []).map((r: any) => ({
          type: r.type,
          value: r.minutesBefore,
          unit: "minutes",
        }))
      );

      const start = new Date(initialData.start);
      const end = new Date(initialData.end);
      setDate(start.toISOString().split("T")[0]);
      setTime(start.toTimeString().slice(0, 5));
      setEndDate(end.toISOString().split("T")[0]);
      setEndTime(end.toTimeString().slice(0, 5));
    }
  }, [initialData]);

  const toggleParentSelection = (parentId: string) => {
    setParentIds((prev) =>
      prev.includes(parentId)
        ? prev.filter((id) => id !== parentId)
        : [...prev, parentId]
    );
  };

  const addReminder = () => {
    setReminders((prev) => [
      ...prev,
      { type: "notification", value: 30, unit: "minutes" },
    ]);
  };

  const updateReminderField = (
    index: number,
    field: "type" | "value" | "unit",
    value: string | number
  ) => {
    setReminders((prev) => {
      const updated = [...prev];
      if (field === "value" && typeof value === "string") {
        updated[index].value = parseFloat(value) || 0;
      } else if (field === "type" && typeof value === "string") {
        updated[index].type = value as ReminderInput["type"];
      } else if (field === "unit" && typeof value === "string") {
        updated[index].unit = value as ReminderInput["unit"];
      }
      return updated;
    });
  };

  const removeReminder = (index: number) => {
    setReminders((prev) => prev.filter((_, i) => i !== index));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setSuccess(false);

    if (!title || !date || !time || !endDate || !endTime || !categoryId) {
      setError("Todos los campos obligatorios deben estar completos.");
      return;
    }

    const start = new Date(`${date}T${time}:00Z`).toISOString();
    const end = new Date(`${endDate}T${endTime}:00Z`).toISOString();

    const remindersConverted = reminders.map((r) => {
      let minutes = r.value;
      if (r.unit === "hours") minutes *= 60;
      if (r.unit === "days") minutes *= 1440;
      return { type: r.type, minutesBefore: minutes };
    });

    try {
      const tokenRes = await fetch("/api/auth/token");
      const { accessToken } = await tokenRes.json();

      const res = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/api/calendar/events`,
        {
          method: "POST",
          headers: {
            Authorization: `Bearer ${accessToken}`,
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            title,
            description,
            start,
            end,
            location,
            categoryId,
            childIds,
            tagIds,
            parentIds,
            timezone,
            recurrenceRule,
            meetingLink,
            reminders: remindersConverted,
          }),
        }
      );

      if (res.ok) {
        setSuccess(true);
        onEventCreated?.();
      } else {
        const errData = await res.json();
        setError(errData.message || "Error al crear evento");
      }
    } catch (err) {
      setError("Error de red o servidor.");
    }
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="form max-w-2xl mx-auto p-6 bg-white shadow rounded-lg"
    >
      <h2 className="text-2xl font-semibold mb-6">➕ Nuevo evento</h2>

      {error && <p className="text-red-600 mb-4">❌ {error}</p>}
      {success && (
        <p className="text-green-600 mb-4">✅ Evento creado correctamente</p>
      )}

      <fieldset className="mb-6">
        <legend className="text-lg font-medium mb-2">
          📝 Detalles básicos
        </legend>
        <input
          type="text"
          placeholder="Título *"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          className="input w-full mb-2"
          required
        />
        <textarea
          placeholder="Descripción"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          className="input w-full mb-2 h-24"
        />
        <div className="flex gap-2 mb-2">
          <input
            type="date"
            value={date}
            onChange={(e) => setDate(e.target.value)}
            className="input flex-1"
          />
          <input
            type="time"
            value={time}
            onChange={(e) => setTime(e.target.value)}
            className="input flex-1"
          />
        </div>
        <div className="flex gap-2 mb-2">
          <input
            type="date"
            value={endDate}
            onChange={(e) => setEndDate(e.target.value)}
            className="input flex-1"
          />
          <input
            type="time"
            value={endTime}
            onChange={(e) => setEndTime(e.target.value)}
            className="input flex-1"
          />
        </div>
        <input
          type="text"
          placeholder="Ubicación"
          value={location}
          onChange={(e) => setLocation(e.target.value)}
          className="input w-full"
        />
      </fieldset>

      <fieldset className="mb-6">
        <legend className="text-lg font-medium mb-2">👥 Participantes</legend>

        <label className="block mb-1">📂 Categoría:</label>
        <select
          value={categoryId}
          onChange={(e) => setCategoryId(e.target.value)}
          className="input mb-2 w-full"
          required
        >
          <option value="">Seleccionar categoría</option>
          {categories.map((cat) => (
            <option key={cat.id} value={cat.id}>
              {cat.name}
            </option>
          ))}
        </select>

        <label className="block mb-1">👶 Hijos/as:</label>
        <select
          multiple
          value={childIds}
          onChange={(e) =>
            setChildIds(
              Array.from(e.target.selectedOptions, (opt) => opt.value)
            )
          }
          className="input mb-4 w-full"
        >
          {children.map((child) => (
            <option key={child.id} value={child.id}>
              {child.firstName}
            </option>
          ))}
        </select>

        <label className="block mb-1">🏷️ Etiquetas:</label>
        <select
          multiple
          value={tagIds}
          onChange={(e) =>
            setTagIds(Array.from(e.target.selectedOptions, (opt) => opt.value))
          }
          className="input mb-4 w-full"
        >
          {tags.map((tag) => (
            <option key={tag.id} value={tag.id}>
              {tag.name}
            </option>
          ))}
        </select>

        <label className="block mb-1">👨‍👩‍👧 Padres:</label>
        <div className="mb-4 border p-2 rounded">
          {parents.map((p) => (
            <label key={p.id} className="block text-sm">
              <input
                type="checkbox"
                checked={parentIds.includes(p.id)}
                onChange={() => toggleParentSelection(p.id)}
                className="mr-2"
              />
              {p.firstName}
            </label>
          ))}
        </div>
      </fieldset>

      <fieldset className="mb-6">
        <legend className="text-lg font-medium mb-2">
          ⚙️ Configuración avanzada
        </legend>

        <label className="block mb-1">🕰 Zona horaria:</label>
        <select
          value={timezone}
          onChange={(e) => setTimezone(e.target.value)}
          className="input mb-2 w-full"
        >
          {TIMEZONES.map((tz) => (
            <option key={tz} value={tz}>
              {tz}
            </option>
          ))}
        </select>

        <label className="block mb-1">🔁 Recurrencia:</label>
        <select
          value={recurrenceRule}
          onChange={(e) => setRecurrenceRule(e.target.value)}
          className="input mb-2 w-full"
        >
          {RECURRENCE_OPTIONS.map((opt) => (
            <option key={opt.value} value={opt.value}>
              {opt.label}
            </option>
          ))}
        </select>

        <label className="block mb-1">🎥 Enlace de reunión (opcional):</label>
        <input
          type="text"
          value={meetingLink}
          onChange={(e) => setMeetingLink(e.target.value)}
          className="input mb-4 w-full"
        />
      </fieldset>

      <fieldset className="mb-6">
        <legend className="text-lg font-medium mb-2">⏰ Recordatorios</legend>
        {reminders.map((reminder, index) => (
          <div key={index} className="flex items-center gap-2 mb-2">
            <select
              value={reminder.type}
              onChange={(e) =>
                updateReminderField(index, "type", e.target.value)
              }
              className="input"
            >
              <option value="notification">Notificación</option>
              <option value="email">Email</option>
              <option value="sms">SMS</option>
            </select>
            <input
              type="number"
              min="0"
              value={reminder.value}
              onChange={(e) =>
                updateReminderField(index, "value", e.target.value)
              }
              className="input w-24"
            />
            <select
              value={reminder.unit}
              onChange={(e) =>
                updateReminderField(index, "unit", e.target.value)
              }
              className="input"
            >
              {REMINDER_UNITS.map((opt) => (
                <option key={opt.value} value={opt.value}>
                  {opt.label}
                </option>
              ))}
            </select>
            <button
              type="button"
              onClick={() => removeReminder(index)}
              className="text-red-600 text-sm px-2 py-1"
            >
              ✖
            </button>
          </div>
        ))}
        <button
          type="button"
          onClick={addReminder}
          className="button button-secondary"
        >
          ➕ Agregar recordatorio
        </button>
      </fieldset>

      <button type="submit" className="button button-primary w-full">
        Crear evento
      </button>
    </form>
  );
}
