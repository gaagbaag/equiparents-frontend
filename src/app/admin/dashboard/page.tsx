"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useAppSelector, useAppDispatch } from "@/redux/hooks";
import { getRedirectRoute } from "@/utils/getRedirectRoute";
// (Opcional) import { fetchAndSetSession } from "@/redux/thunks/auth/fetchAndSetSession";
// Si tienes un thunk o hook para cargar la sesión, podrías usarlo también

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
  const dispatch = useAppDispatch();

  // roles e isAuthenticated vienen de tu store Redux (ej. state.auth)
  const { roles, isAuthenticated } = useAppSelector((state) => state.auth);

  const [statsData, setStatsData] = useState<AdminStats | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Estado adicional para indicar si ya cargamos la sesión/rol
  const [sessionChecked, setSessionChecked] = useState(false);

  useEffect(() => {
    // 1) Asegurarte de cargar la sesión/rol si no está en store
    // Ejemplo: si tienes un thunk fetchAndSetSession, lo llamas aquí:
    // if (!isAuthenticated) {
    //   dispatch(fetchAndSetSession()).finally(() => setSessionChecked(true));
    // } else {
    //   setSessionChecked(true);
    // }

    // Si tu store ya está listo, simplemente marcamos:
    setSessionChecked(true);
  }, [isAuthenticated, dispatch]);

  useEffect(() => {
    // 2) Cuando la sesión ya se revisó, si no eres admin => redirect
    if (sessionChecked) {
      if (!roles.includes("admin")) {
        router.push(getRedirectRoute(roles));
      }
    }
  }, [sessionChecked, roles, router]);

  useEffect(() => {
    // 3) Solo cargamos datos si la sesión ya está verificada y somos admin
    if (!sessionChecked) return;
    if (!roles.includes("admin")) return;

    const fetchStats = async () => {
      setLoading(true);
      setError(null);

      try {
        // A) Obtener token
        const tokenRes = await fetch("/api/auth/token", {
          credentials: "include",
        });
        if (!tokenRes.ok) throw new Error("No se pudo obtener token");
        const tokenData = await tokenRes.json();
        const accessToken = tokenData.accessToken || tokenData.token;
        if (!accessToken) throw new Error("Token inválido o vacío");

        // B) Llamar a /api/admin/dashboard con Bearer
        const res = await fetch(
          `${process.env.NEXT_PUBLIC_API_URL}/api/admin/dashboard`,
          {
            headers: {
              Authorization: `Bearer ${accessToken}`,
            },
            credentials: "include",
          }
        );
        if (!res.ok) throw new Error("Error al obtener estadísticas");
        const stats = await res.json();
        setStatsData(stats);
      } catch (err: any) {
        console.error("❌ Error cargando estadísticas:", err);
        setError("Error al cargar las estadísticas.");
      } finally {
        setLoading(false);
      }
    };

    fetchStats();
  }, [sessionChecked, roles]);

  // 4) Render
  if (!sessionChecked) {
    return <p className="p-4">Verificando sesión...</p>;
  }

  if (!roles.includes("admin")) {
    return null; // o un loading, pues en breve redirigimos
  }

  if (loading) {
    return <p className="p-4">Cargando estadísticas del sistema...</p>;
  }

  if (error) {
    return <p className="p-4 text-red-500">{error}</p>;
  }

  if (!statsData) {
    return <p className="p-4">No se encontraron estadísticas.</p>;
  }

  return (
    <main className="p-4">
      <h1 className="text-2xl font-bold mb-6">📊 Panel de administración</h1>

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-8">
        <Stat label="Usuarios" value={statsData.users} />
        <Stat label="Cuentas parentales" value={statsData.accounts} />
        <Stat label="Hijos" value={statsData.children} />
      </div>

      <section>
        <h2 className="text-xl font-semibold mb-4">🕓 Últimas acciones</h2>
        <ul className="space-y-4">
          {statsData.history.map((h) => (
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
