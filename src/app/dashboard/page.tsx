"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";

export default function DashboardRedirectPage() {
  const router = useRouter();

  useEffect(() => {
    const redirectByRole = async () => {
      try {
        const tokenRes = await fetch("/api/auth/token");
        const { accessToken } = await tokenRes.json();

        const userRes = await fetch(
          `${process.env.NEXT_PUBLIC_API_URL}/api/users/me`,
          {
            headers: {
              Authorization: `Bearer ${accessToken}`,
            },
          }
        );

        if (!userRes.ok)
          throw new Error("No se pudo obtener el rol del usuario");

        const user = await userRes.json();
        if (user.role === "admin") {
          router.replace("/admin/dashboard");
        } else {
          router.replace("/dashboard/parent");
        }
      } catch (err) {
        console.error("❌ Error redirigiendo:", err);
        router.replace("/api/auth/login");
      }
    };

    redirectByRole();
  }, [router]);

  return <p>Redirigiendo al panel correspondiente...</p>;
}
