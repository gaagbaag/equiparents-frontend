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
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchHistory = async () => {
      try {
        const tokenRes = await fetch("/api/auth/token");
        const { accessToken } = await tokenRes.json();

        const endpoint = recentOnly ? "/api/history/recent" : "/api/history";

        const res = await fetch(
          `${process.env.NEXT_PUBLIC_API_URL}${endpoint}`,
          {
            headers: {
              Authorization: `Bearer ${accessToken}`,
            },
          }
        );

        if (!res.ok) {
          throw new Error("Error al obtener historial");
        }

        const data = await res.json();
        setHistory(data.history);
      } catch (err) {
        if (err instanceof Error) {
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
