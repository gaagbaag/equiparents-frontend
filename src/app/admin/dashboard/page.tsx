"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useAppSelector } from "@/redux/hooks";
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
  const { roles } = useAppSelector((state) => state.auth);
  const [data, setData] = useState<AdminStats | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!roles.includes("admin")) {
      router.push(getRedirectRoute(roles));
      return;
    }

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

        if (!res.ok) throw new Error("Error al obtener estadísticas");
        const stats = await res.json();
        setData(stats);
      } catch (err) {
        console.error("❌ Error cargando estadísticas:", err);
        setError("Error al cargar las estadísticas.");
      } finally {
        setIsLoading(false);
      }
    };

    fetchStats();
  }, [roles, router]);

  if (isLoading)
    return <p className="p-4">Cargando estadísticas del sistema...</p>;
  if (error) return <p className="p-4 text-red-500">{error}</p>;
  if (!data) return <p className="p-4">No se encontraron estadísticas.</p>;

  return (
    <main className="p-4">
      <h1 className="text-2xl font-bold mb-6">📊 Panel de administración</h1>

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-8">
        <Stat label="Usuarios" value={data.users} />
        <Stat label="Cuentas parentales" value={data.accounts} />
        <Stat label="Hijos" value={data.children} />
      </div>

      <section>
        <h2 className="text-xl font-semibold mb-4">🕓 Últimas acciones</h2>
        <ul className="space-y-4">
          {data.history.map((h) => (
            <li key={h.id} className="bg-white p-4 rounded shadow-sm border">
              <p className="font-medium">{h.summary}</p>
              <p className="text-sm text-gray-600">
                {new Date(h.createdAt).toLocaleString("es-CL")}
              </p>
              {h.user && (
                <p className="text-sm text-gray-500">
                  {h.user.firstName} {h.user.lastName} ({h.user.email})
                </p>
              )}
              {h.category?.name && (
                <p className="text-sm text-gray-400">
                  Categoría: {h.category.name}
                </p>
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
    <div className="bg-gray-100 p-4 rounded shadow text-center">
      <h3 className="text-lg font-semibold mb-2">{label}</h3>
      <p className="text-2xl font-bold">{value}</p>
    </div>
  );
}
