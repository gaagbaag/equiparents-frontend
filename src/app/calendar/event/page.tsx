"use client";

import { useEffect, useState } from "react";
import { format } from "date-fns";

type Event = {
  id: string;
  title: string;
  start: string;
  end: string;
  notes?: string;
  category?: { id: string; name: string };
  child?: { name: string };
  calendar: {
    parentalAccount: {
      id: string;
      name: string;
    };
  };
};

export default function AdminEventsPage() {
  const [events, setEvents] = useState<Event[]>([]);
  const [filterAccount, setFilterAccount] = useState("");
  const [filterCategory, setFilterCategory] = useState("");
  const [filterDate, setFilterDate] = useState("");

  const [allCategories, setAllCategories] = useState<
    { id: string; name: string }[]
  >([]);

  useEffect(() => {
    const fetchData = async () => {
      const tokenRes = await fetch("/api/auth/token");
      const { accessToken } = await tokenRes.json();

      const [eventRes, catRes] = await Promise.all([
        fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/admin/events`, {
          headers: { Authorization: `Bearer ${accessToken}` },
        }),
        fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/categories`, {
          headers: { Authorization: `Bearer ${accessToken}` },
        }),
      ]);

      if (eventRes.ok) {
        const data = await eventRes.json();
        setEvents(data.events || []);
      }

      if (catRes.ok) {
        const catData = await catRes.json();
        setAllCategories(catData.categories || []);
      }
    };

    fetchData();
  }, []);

  const filtered = events.filter((e) => {
    const matchesAccount = e.calendar.parentalAccount.name
      .toLowerCase()
      .includes(filterAccount.toLowerCase());

    const matchesCategory = filterCategory
      ? e.category?.id === filterCategory
      : true;

    const matchesDate = filterDate
      ? format(new Date(e.start), "yyyy-MM-dd") === filterDate
      : true;

    return matchesAccount && matchesCategory && matchesDate;
  });

  return (
    <main className="container">
      <h1>🗓️ Eventos del sistema</h1>

      {/* Filtros */}
      <div style={{ display: "flex", gap: "1rem", margin: "1rem 0" }}>
        <input
          type="text"
          placeholder="🔍 Cuenta parental"
          value={filterAccount}
          onChange={(e) => setFilterAccount(e.target.value)}
        />

        <select
          value={filterCategory}
          onChange={(e) => setFilterCategory(e.target.value)}
        >
          <option value="">Todas las categorías</option>
          {allCategories.map((c) => (
            <option key={c.id} value={c.id}>
              {c.name}
            </option>
          ))}
        </select>

        <input
          type="date"
          value={filterDate}
          onChange={(e) => setFilterDate(e.target.value)}
        />
      </div>

      {/* Tabla */}
      <table style={{ width: "100%", borderCollapse: "collapse" }}>
        <thead>
          <tr style={{ background: "#f0f0f0" }}>
            <th>Cuenta</th>
            <th>Título</th>
            <th>Hijo</th>
            <th>Categoría</th>
            <th>Inicio</th>
            <th>Fin</th>
          </tr>
        </thead>
        <tbody>
          {filtered.map((event) => (
            <tr key={event.id} style={{ borderBottom: "1px solid #ccc" }}>
              <td>{event.calendar.parentalAccount.name}</td>
              <td>{event.title}</td>
              <td>{event.child?.name || "—"}</td>
              <td>{event.category?.name || "—"}</td>
              <td>{format(new Date(event.start), "dd/MM/yyyy HH:mm")}</td>
              <td>{format(new Date(event.end), "dd/MM/yyyy HH:mm")}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </main>
  );
}
