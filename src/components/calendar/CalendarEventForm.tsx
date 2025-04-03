// CalendarEventForm.tsx
"use client";

import { useState } from "react";

interface CalendarEventFormProps {
  children: { id: string; firstName: string }[];
  categories: { id: string; name: string }[];
  onEventCreated?: () => void;
}

export default function CalendarEventForm({
  children,
  categories,
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
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);

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

    try {
      const tokenRes = await fetch("/api/auth/token");
      const { accessToken } = await tokenRes.json();

      const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/events`, {
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
        }),
      });

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
        className="input mb-2"
      />

      <textarea
        placeholder="Descripción"
        value={description}
        onChange={(e) => setDescription(e.target.value)}
        className="input mb-2"
      />

      <div className="flex gap-2 mb-2">
        <input
          type="date"
          value={date}
          onChange={(e) => setDate(e.target.value)}
          className="input"
        />
        <input
          type="time"
          value={time}
          onChange={(e) => setTime(e.target.value)}
          className="input"
        />
      </div>

      <div className="flex gap-2 mb-2">
        <input
          type="date"
          value={endDate}
          onChange={(e) => setEndDate(e.target.value)}
          className="input"
        />
        <input
          type="time"
          value={endTime}
          onChange={(e) => setEndTime(e.target.value)}
          className="input"
        />
      </div>

      <input
        type="text"
        placeholder="Ubicación"
        value={location}
        onChange={(e) => setLocation(e.target.value)}
        className="input mb-2"
      />

      <label className="block mb-1">📂 Categoría:</label>
      <select
        value={categoryId}
        onChange={(e) => setCategoryId(e.target.value)}
        className="input mb-2"
        required
      >
        <option value="">Seleccionar categoría</option>
        {categories.map((cat) => (
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
        className="input mb-4"
      >
        {children.map((child) => (
          <option key={child.id} value={child.id}>
            {child.firstName}
          </option>
        ))}
      </select>

      <button
        type="submit"
        className="bg-green-600 text-white px-4 py-2 rounded"
      >
        Crear evento
      </button>
    </form>
  );
}
