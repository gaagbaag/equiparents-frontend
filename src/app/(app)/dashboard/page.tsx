"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useAppSelector } from "@/redux/hooks";

export default function DashboardIndexPage() {
  const router = useRouter();
  const { user, isAuthenticated } = useAppSelector((state) => state.auth);
  const [checked, setChecked] = useState(false);

  useEffect(() => {
    if (!isAuthenticated || !user?.role) return;

    if (user.role === "admin") {
      router.replace("/admin/dashboard");
    } else if (user.role === "parent") {
      router.replace("/dashboard/parent");
    } else {
      console.warn("⚠️ Rol desconocido:", user.role);
    }

    setChecked(true);
  }, [router, user, isAuthenticated]);

  if (!checked) {
    return (
      <div className="p-4 text-center">
        ⏳ Verificando acceso al dashboard...
      </div>
    );
  }

  return null;
}
