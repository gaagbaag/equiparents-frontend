"use client";

import React, { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

type HistoryEntry = {
  id: string;
  summary: string;
  createdAt: string;
  user?: {
    firstName: string;
    lastName: string;
    email: string;
  };
  category?: {
    name?: string;
  };
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
  const [isAdmin, setIsAdmin] = useState<boolean | null>(null); // Guardar estado del rol admin
  const [isLoading, setIsLoading] = useState<boolean>(true); // Estado de carga
  const [error, setError] = useState<string | null>(null); // Estado de error

  useEffect(() => {
    const checkAdminAccess = async () => {
      try {
        // Obtener datos de sesión desde el endpoint /api/session
        const sessionRes = await fetch("/api/session");
        const user = await sessionRes.json();
        console.log("📡 Respuesta de /api/session:", user);

        // Verificar si el rol de admin está presente en el array de roles
        if (user?.roles && user.roles.includes("admin")) {
          setIsAdmin(true); // Usuario tiene rol admin
        } else {
          setIsAdmin(false); // No tiene rol admin
          console.log("🚫 El usuario no tiene rol de admin, redirigiendo...");
          router.push("/dashboard"); // Redirige si no es admin
        }
      } catch (err) {
        console.error("Error al verificar sesión", err);
        setError("Error al verificar el rol de usuario.");
        router.push("/dashboard"); // En caso de error, también redirige
      }
    };
    checkAdminAccess();
  }, [router]);

  // Verificar si estamos listos para cargar estadísticas
  useEffect(() => {
    if (isAdmin === null) return; // Esperamos hasta que se determine el rol admin

    if (isAdmin) {
      const fetchStats = async () => {
        try {
          setIsLoading(true); // Empezamos el loading

          const tokenRes = await fetch("/api/auth/token");
          const { accessToken } = await tokenRes.json();

          const res = await fetch(
            `${process.env.NEXT_PUBLIC_API_URL}/api/admin/dashboard`,
            {
              headers: {
                Authorization: `Bearer ${accessToken}`,
              },
            }
          );

          if (!res.ok) throw new Error("Error al obtener datos");

          const stats = await res.json();
          setData(stats);
          setIsLoading(false); // Terminamos el loading
        } catch (err) {
          console.error("❌ Error cargando stats:", err);
          setError("Error al cargar las estadísticas.");
          setIsLoading(false); // Terminamos el loading
        }
      };

      fetchStats();
    }
  }, [isAdmin]);

  // Estado de carga
  if (isLoading) return <p>Cargando estadísticas del sistema...</p>;

  // Mostrar error
  if (error) return <p>{error}</p>;

  // Asegurarse de que data no sea null antes de renderizar
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
