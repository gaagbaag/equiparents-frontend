// src/components/auth/RequireProfileComplete.tsx
"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAppSelector } from "@/redux/hooks";
import { ExtendedAuthUser } from "@/types/auth";

export default function RequireProfileComplete({
  children,
}: {
  children: React.ReactNode;
}) {
  const router = useRouter();
  const user = useAppSelector((state) => state.auth.user) as ExtendedAuthUser;

  useEffect(() => {
    const isProfileIncomplete =
      !user?.firstName || !user?.lastName || !user?.phone || !user?.countryCode;

    if (isProfileIncomplete) {
      console.warn("🔒 Perfil incompleto. Redirigiendo a /onboarding/profile");
      router.replace("/onboarding/profile");
    }
  }, [router, user]);

  return <>{children}</>;
}
