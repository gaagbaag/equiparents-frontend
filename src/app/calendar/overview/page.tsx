"use client";

import { useState, useEffect } from "react";

interface CalendarEventFormProps {
  onEventCreated?: () => void;
}

export default function CalendarEventForm({
  onEventCreated,
}: CalendarEventFormProps) {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [date, setDate] = useState("");
  const [time, setTime] = useState("");
  const [location, setLocation] = useState("");
  const [categoryId, setCategoryId] = useState("");
  const [categories, setCategories] = useState<{ id: string; name: string }[]>(
    []
  );
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);

  useEffect(() => {
    const loadCategories = async () => {
      try {
        const tokenRes = await fetch("/api/auth/token");
        const { accessToken } = await tokenRes.json();

        const res = await fetch(
          `${process.env.NEXT_PUBLIC_API_URL}/api/categories`,
          {
            headers: { Authorization: `Bearer ${accessToken}` },
          }
        );

        if (res.ok) {
          const data = await res.json();
          setCategories(data.categories || []);
        }
      } catch (err) {
        console.error("Error cargando categorías:", err);
      }
    };
    loadCategories();
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setSuccess(false);

    if (!title || !date || !categoryId) {
      setError("Título, fecha y categoría son obligatorios.");
      return;
    }

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
          date,
          time,
          location,
          categoryId,
        }),
      });

      if (res.ok) {
        setSuccess(true);
        setTitle("");
        setDescription("");
        setDate("");
        setTime("");
        setLocation("");
        setCategoryId("");
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

      <input
        type="date"
        value={date}
        onChange={(e) => setDate(e.target.value)}
        className="input mb-2"
      />

      <input
        type="time"
        value={time}
        onChange={(e) => setTime(e.target.value)}
        className="input mb-2"
      />

      <input
        type="text"
        placeholder="Ubicación"
        value={location}
        onChange={(e) => setLocation(e.target.value)}
        className="input mb-2"
      />

      <select
        value={categoryId}
        onChange={(e) => setCategoryId(e.target.value)}
        className="input mb-4"
      >
        <option value="">Selecciona una categoría *</option>
        {categories.map((c) => (
          <option key={c.id} value={c.id}>
            {c.name}
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
