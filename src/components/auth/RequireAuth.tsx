"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAppSelector } from "@/redux/hooks";

type RequireAuthProps = {
  children: React.ReactNode;
};

export default function RequireAuth({ children }: RequireAuthProps) {
  const router = useRouter();
  const { isAuthenticated, token, user } = useAppSelector(
    (state) => state.auth
  );

  const isValidSession = !!token && !!user && isAuthenticated;

  useEffect(() => {
    if (!isValidSession) {
      console.warn("🔐 Sesión no válida, redirigiendo a login");
      router.replace("/api/auth/login");
    }
  }, [isValidSession, router]);

  if (!isValidSession) return null;

  return <>{children}</>;
}
