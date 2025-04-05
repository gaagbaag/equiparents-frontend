"use client";

import { useEffect, useState } from "react";

export type HistoryEntry = {
  id: string;
  summary: string;
  type: string;
  createdAt: string;
  category?: {
    name: string;
    color?: string;
    icon?: string;
  };
};

export function useHistory(recentOnly: boolean = true, refreshKey?: number) {
  const [history, setHistory] = useState<HistoryEntry[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchHistory = async () => {
      setLoading(true);
      setError(null);

      try {
        const tokenRes = await fetch("/api/auth/token");
        const { accessToken } = await tokenRes.json();

        if (!tokenRes.ok || !accessToken) {
          throw new Error("No se pudo obtener el token de acceso");
        }

        const endpoint = recentOnly ? "/api/history/recent" : "/api/history";
        const response = await fetch(
          `${process.env.NEXT_PUBLIC_API_URL}${endpoint}`,
          {
            headers: {
              Authorization: `Bearer ${accessToken}`,
            },
          }
        );

        if (!response.ok) {
          throw new Error("Error al obtener historial");
        }

        const data = await response.json();
        setHistory(data.history ?? []);
      } catch (err) {
        if (err instanceof Error) {
          console.error("📛 Error en useHistory:", err.message);
          setError(err.message);
        } else {
          setError("Error desconocido al obtener historial");
        }
      } finally {
        setLoading(false);
      }
    };

    fetchHistory();
  }, [recentOnly, refreshKey]);

  return { history, loading, error };
}
