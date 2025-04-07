"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAppSelector } from "@/redux/hooks";

export default function RequireParent({
  children,
}: {
  children: React.ReactNode;
}) {
  const router = useRouter();
  const { isAuthenticated, token, roles } = useAppSelector(
    (state) => state.auth
  );

  useEffect(() => {
    if (!isAuthenticated || !token || !roles.includes("parent")) {
      router.replace("/"); // o redirige a /admin
    }
  }, [isAuthenticated, token, roles, router]);

  if (!isAuthenticated || !token || !roles.includes("parent")) return null;

  return <>{children}</>;
}
