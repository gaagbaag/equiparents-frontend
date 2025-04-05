"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

export default function DashboardRedirectPage() {
  const router = useRouter();
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const redirectByRole = async () => {
      try {
        const tokenRes = await fetch("/api/auth/token");
        const { token } = await tokenRes.json();

        if (!token) {
          setError("Token no disponible");
          return;
        }

        const userRes = await fetch(
          `${process.env.NEXT_PUBLIC_API_URL}/api/users/me`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );

        if (!userRes.ok) {
          throw new Error("No se pudo obtener el rol del usuario");
        }

        const user = await userRes.json();

        // ✅ Importante: usar push para que desmonten correctamente
        if (user.role === "admin") {
          router.push("/admin/dashboard");
        } else {
          router.push("/dashboard/parent");
        }
      } catch (err: any) {
        setError(err.message || "Error desconocido");
        router.push("/api/auth/login");
      }
    };

    redirectByRole();
  }, [router]);

  if (error) {
    return <p className="error-message">{error}</p>;
  }

  return <p>Redireccionando al panel correspondiente...</p>;
}
