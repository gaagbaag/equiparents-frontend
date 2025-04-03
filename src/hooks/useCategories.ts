"use client";

import { useEffect, useState } from "react";

type Category = {
  id: string;
  name: string;
  type: string;
  color?: string;
  icon?: string;
};

export function useCategories(type: "event" | "expense" | "history") {
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!type) return;

    const fetchCategories = async () => {
      try {
        setLoading(true);

        const tokenRes = await fetch("/api/auth/token");
        const { accessToken } = await tokenRes.json();

        const res = await fetch(`/api/categories?type=${type}`, {
          headers: {
            Authorization: `Bearer ${accessToken}`,
          },
        });

        if (!res.ok) {
          throw new Error("No se pudieron cargar las categorías");
        }

        const data: Category[] = await res.json();
        setCategories(data);
      } catch (err: any) {
        setError(err.message || "Error inesperado");
      } finally {
        setLoading(false);
      }
    };

    fetchCategories();
  }, [type]);

  return { categories, loading, error };
}
