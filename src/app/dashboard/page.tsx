// dashboard/page.tsx
"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAppSelector } from "@/redux/hooks";

export default function DashboardRedirectPage() {
  const router = useRouter();
  const { user, isAuthenticated } = useAppSelector((state) => state.auth);

  useEffect(() => {
    if (!isAuthenticated) return;

    if (user?.role === "admin") {
      router.replace("/admin/dashboard");
    } else if (user?.role === "parent") {
      router.replace("/dashboard/parent");
    } else {
      router.replace("/onboarding");
    }
  }, [router, isAuthenticated, user]);

  return <p className="p-4">Redirigiendo a tu panel...</p>;
}
