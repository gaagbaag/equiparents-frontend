"use client";

import React, { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { getRedirectRoute } from "@/utils/getRedirectRoute";

type HistoryEntry = {
  id: string;
  summary: string;
  createdAt: string;
  user?: { firstName: string; lastName: string; email: string };
  category?: { name?: string };
};

type AdminStats = {
  users: number;
  accounts: number;
  children: number;
  history: HistoryEntry[];
};

export default function AdminDashboardPage() {
  const router = useRouter();
  const [data, setData] = useState<AdminStats | null>(null);
  const [roles, setRoles] = useState<string[] | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const checkSession = async () => {
      try {
        const sessionRes = await fetch("/api/session");
        const session = await sessionRes.json();
        const userRoles = session?.roles || [];
        setRoles(userRoles);

        if (!userRoles.includes("admin")) {
          router.push(getRedirectRoute(userRoles));
        }
      } catch (err) {
        console.error("❌ Error al verificar sesión:", err);
        setError("Error al verificar sesión.");
        router.push(getRedirectRoute([]));
      }
    };
    checkSession();
  }, [router]);

  useEffect(() => {
    if (!roles?.includes("admin")) return;

    const fetchStats = async () => {
      try {
        setIsLoading(true);

        const tokenRes = await fetch("/api/auth/token");
        const { accessToken } = await tokenRes.json();

        const res = await fetch(
          `${process.env.NEXT_PUBLIC_API_URL}/api/admin/dashboard`,
          {
            headers: { Authorization: `Bearer ${accessToken}` },
          }
        );

        if (!res.ok) throw new Error("Error al obtener datos");

        const stats = await res.json();
        setData(stats);
      } catch (err) {
        console.error("❌ Error cargando stats:", err);
        setError("Error al cargar las estadísticas.");
      } finally {
        setIsLoading(false);
      }
    };

    fetchStats();
  }, [roles]);

  if (isLoading) return <p>Cargando estadísticas del sistema...</p>;
  if (error) return <p>{error}</p>;
  if (!data) return <p>No se encontraron estadísticas.</p>;

  return (
    <main className="container">
      <h1>📊 Panel de administración</h1>

      <div style={{ display: "flex", gap: "2rem", marginTop: "1.5rem" }}>
        <Stat label="Usuarios" value={data.users} />
        <Stat label="Cuentas parentales" value={data.accounts} />
        <Stat label="Hijos" value={data.children} />
      </div>

      <section style={{ marginTop: "2.5rem" }}>
        <h2>🕓 Últimas acciones</h2>
        <ul style={{ paddingLeft: "1rem" }}>
          {data.history.map((h) => (
            <li key={h.id} style={{ marginBottom: "0.75rem" }}>
              <strong>{h.summary}</strong> —{" "}
              {new Date(h.createdAt).toLocaleString("es-CL")}
              {h.user && (
                <div style={{ fontSize: "0.85rem", color: "#555" }}>
                  {h.user.firstName} {h.user.lastName} ({h.user.email})
                </div>
              )}
              {h.category?.name && (
                <div style={{ fontSize: "0.8rem", color: "#888" }}>
                  Categoría: {h.category.name}
                </div>
              )}
            </li>
          ))}
        </ul>
      </section>
    </main>
  );
}

function Stat({ label, value }: { label: string; value: number }) {
  return (
    <div
      style={{
        padding: "1rem",
        backgroundColor: "#f4f4f4",
        borderRadius: "8px",
        flex: "1",
        textAlign: "center",
        boxShadow: "0 2px 4px rgba(0,0,0,0.05)",
      }}
    >
      <h3 style={{ margin: "0 0 0.5rem" }}>{label}</h3>
      <p style={{ fontSize: "2rem", margin: 0 }}>{value}</p>
    </div>
  );
}
