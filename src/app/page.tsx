"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";

export default function HomePage() {
  const [session, setSession] = useState<any | null>(null);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    const fetchSession = async () => {
      try {
        const res = await fetch("/api/session");
        if (!res.ok) throw new Error("No se pudo obtener la sesión");

        const data = await res.json();
        setSession(data);

        // ✅ Si existe token (el usuario viene de Auth0), redirigimos
        if (data?.token) {
          router.push("/onboarding");
        }
      } catch (err) {
        console.error("Error al obtener la sesión:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchSession();
  }, [router]);

  if (loading) {
    return (
      <main className="p-6 page-center">
        <h1 className="text-2xl mb-4 heading-xl">Equi·Parents</h1>
        <p>Cargando...</p>
      </main>
    );
  }

  return (
    <main className="p-6 page-center">
      <h1 className="text-2xl mb-4 heading-xl">Equi·Parents</h1>
      <a href="/api/auth/login">
        <button className="bg-blue-600 text-white px-4 py-2 rounded">
          Iniciar sesión
        </button>
      </a>
      <a href="/api/auth/login?screen_hint=signup">
        <button className="bg-green-600 text-white px-4 py-2 rounded mt-4">
          Registrarse
        </button>
      </a>
    </main>
  );
}
