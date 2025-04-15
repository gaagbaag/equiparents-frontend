"use client";

import React, { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

export default function AdminEventsPage() {
  const router = useRouter();
  const [events, setEvents] = useState<any[]>([]);

  useEffect(() => {
    const checkAdminAccess = async () => {
      try {
        const res = await fetch(
          `${process.env.NEXT_PUBLIC_API_URL}/api/session`,
          {
            credentials: "include",
          }
        );
        const data = await res.json();
        if (!data.user || data.user.role !== "admin") {
          router.push("/dashboard");
        }
      } catch (err) {
        console.error("Error al verificar sesión");
        router.push("/dashboard");
      }
    };
    checkAdminAccess();
  }, [router]);

  useEffect(() => {
    const fetchEvents = async () => {
      try {
        const tokenRes = await fetch("/api/auth/token");
        const { accessToken } = await tokenRes.json();

        const res = await fetch(
          `${process.env.NEXT_PUBLIC_API_URL}/api/admin/events`,
          {
            headers: {
              Authorization: `Bearer ${accessToken}`,
            },
          }
        );

        if (!res.ok) throw new Error("Error al obtener eventos");

        const data = await res.json();
        setEvents(data.events || []);
      } catch (err) {
        console.error("❌ Error cargando eventos:", err);
      }
    };

    fetchEvents();
  }, []);

  return (
    <main className="container">
      <h1>🗓️ Eventos del sistema</h1>
      <ul>
        {events.map((event) => (
          <li key={event.id}>
            {event.title} — {new Date(event.date).toLocaleString()}
          </li>
        ))}
      </ul>
    </main>
  );
}
