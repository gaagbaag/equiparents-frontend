"use client";
import { useState, useEffect } from "react";

interface Child {
  id: string;
  firstName: string;
}

interface Parent {
  id: string;
  firstName: string;
}

interface Category {
  id: string;
  name: string;
}

interface Tag {
  id: string;
  name: string;
}

export interface ReminderInput {
  type: "notification" | "email" | "sms";
  value: number;
  unit: "minutes" | "hours" | "days";
}

interface CalendarEventFormProps {
  children: Child[];
  parents: Parent[];
  categories: Category[];
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
  children,
  parents = [],
  categories,
  tags,
  onEventCreated,
}: CalendarEventFormProps) {
  const [title, setTitle] = useState("");
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

  const toggleParentSelection = (parentId: string) => {
    setParentIds((prev) => {
      if (prev.includes(parentId)) {
        return prev.filter((id) => id !== parentId);
      } else {
        return [...prev, parentId];
      }
    });
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
    value: string
  ) => {
    setReminders((prev) => {
      const updated = [...prev];
      if (field === "value") {
        updated[index].value = parseFloat(value) || 0;
      } else if (field === "type") {
        if (["notification", "email", "sms"].includes(value)) {
          updated[index].type = value as "notification" | "email" | "sms";
        }
      } else if (field === "unit") {
        if (["minutes", "hours", "days"].includes(value)) {
          updated[index].unit = value as "minutes" | "hours" | "days";
        }
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

    // Convertir cada recordatorio a minutos
    const remindersConverted = reminders.map((r) => {
      let multiplier = 1;
      if (r.unit === "hours") multiplier = 60;
      else if (r.unit === "days") multiplier = 1440;
      return {
        type: r.type,
        minutesBefore: r.value * multiplier,
      };
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
        setTitle("");
        setDescription("");
        setDate("");
        setTime("");
        setEndDate("");
        setEndTime("");
        setLocation("");
        setCategoryId("");
        setChildIds([]);
        setTagIds([]);
        setParentIds([]);
        setTimezone(Intl.DateTimeFormat().resolvedOptions().timeZone);
        setRecurrenceRule("");
        setMeetingLink("");
        setReminders([]);
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
    <form onSubmit={handleSubmit} className="form max-w-md mx-auto">
      <h2 className="heading-lg mb-4">➕ Nuevo evento</h2>
      {error && <p className="text-red-600 mb-2">{error}</p>}
      {success && (
        <p className="text-green-600 mb-2">✅ Evento creado correctamente</p>
      )}
      <input
        type="text"
        placeholder="Título *"
        value={title}
        onChange={(e) => setTitle(e.target.value)}
        className="input mb-2 w-full"
      />
      <textarea
        placeholder="Descripción"
        value={description}
        onChange={(e) => setDescription(e.target.value)}
        className="input mb-2 w-full border border-gray-300 p-2"
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
        className="input mb-2 w-full"
      />
      <label className="block mb-1">📂 Categoría:</label>
      <select
        value={categoryId}
        onChange={(e) => setCategoryId(e.target.value)}
        className="input mb-2 w-full"
        required
      >
        <option value="">Seleccionar categoría</option>
        {Array.isArray(categories) &&
          categories.map((cat) => (
            <option key={cat.id} value={cat.id}>
              {cat.name}
            </option>
          ))}
      </select>
      <label className="block mb-1">👶 Hijos participantes:</label>
      <select
        multiple
        value={childIds}
        onChange={(e) =>
          setChildIds(Array.from(e.target.selectedOptions, (opt) => opt.value))
        }
        className="input mb-4 w-full"
      >
        {Array.isArray(children) &&
          children.map((child) => (
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
        {Array.isArray(tags) &&
          tags.map((tag) => (
            <option key={tag.id} value={tag.id}>
              {tag.name}
            </option>
          ))}
      </select>
      <label className="block mb-1">👨‍👩‍👧 Padres participantes:</label>
      <div className="mb-4 border p-2">
        {Array.isArray(parents) &&
          parents.map((p) => (
            <div key={p.id} className="flex items-center gap-2 my-2">
              <label className="flex items-center gap-1">
                <input
                  type="checkbox"
                  checked={parentIds.includes(p.id)}
                  onChange={() => toggleParentSelection(p.id)}
                />
                {p.firstName}
              </label>
            </div>
          ))}
      </div>
      <label className="block mb-1">🕰 Zona horaria:</label>
      <select
        value={timezone}
        onChange={(e) => setTimezone(e.target.value)}
        className="input mb-4 w-full"
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
        className="input mb-4 w-full"
      >
        {RECURRENCE_OPTIONS.map((opt) => (
          <option key={opt.value} value={opt.value}>
            {opt.label}
          </option>
        ))}
      </select>
      <label className="block mb-1">🎥 Enlace de conferencia (opcional):</label>
      <input
        type="text"
        placeholder="Enlace de reunión"
        value={meetingLink}
        onChange={(e) => setMeetingLink(e.target.value)}
        className="input mb-4 w-full"
      />
      <label className="block mb-1">⏰ Recordatorios:</label>
      {reminders.map((reminder, index) => (
        <div key={index} className="flex items-center gap-2 mb-2">
          <select
            value={reminder.type}
            onChange={(e) => updateReminderField(index, "type", e.target.value)}
            className="input flex-1"
          >
            <option value="notification">Notificación</option>
            <option value="email">Email</option>
            <option value="sms">SMS</option>
          </select>
          <input
            type="number"
            min="0"
            step="1"
            value={reminder.value}
            onChange={(e) =>
              updateReminderField(index, "value", e.target.value)
            }
            className="input flex-1"
            placeholder="Valor"
          />
          <select
            value={reminder.unit}
            onChange={(e) => updateReminderField(index, "unit", e.target.value)}
            className="input flex-1"
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
            className="bg-red-600 text-white px-2 py-1 rounded"
          >
            X
          </button>
        </div>
      ))}
      <button
        type="button"
        onClick={addReminder}
        className="bg-blue-600 text-white px-4 py-2 rounded mb-4"
      >
        Agregar recordatorio
      </button>
      <button
        type="submit"
        className="bg-green-600 text-white px-4 py-2 rounded w-full"
      >
        Crear evento
      </button>
    </form>
  );
}
