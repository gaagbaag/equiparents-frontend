// hooks/useCheckSession.ts
"use client";

import { useEffect, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import { useAppDispatch, useAppSelector } from "@/redux/hooks";
import { setUser, setAuthLoading, logout } from "@/redux/slices/authSlice";
import { getRedirectRoute } from "@/utils/getRedirectRoute";

export function useCheckSession() {
  const router = useRouter();
  const dispatch = useAppDispatch();
  const { token, user, isAuthenticated } = useAppSelector(
    (state) => state.auth
  );
  const [loading, setLoading] = useState(true);
  const hasChecked = useRef(false); // ✅ para evitar múltiples llamadas

  useEffect(() => {
    if (hasChecked.current) return;
    hasChecked.current = true;

    dispatch(setAuthLoading(true)); // ⏳ empieza carga

    const validateSession = async () => {
      try {
        const res = await fetch("/api/session");
        if (!res.ok) throw new Error("No se pudo validar la sesión");

        const { user, roles = [] } = await res.json();
        if (!user) throw new Error("Usuario no encontrado en la sesión");

        dispatch(setUser({ user, token: "", roles }));
        console.log("✅ Sesión validada desde frontend");
      } catch (err) {
        console.error("❌ Error al validar sesión:", err);
        dispatch(logout());
        if (window.location.pathname !== "/api/auth/login") {
          const redirectTo = getRedirectRoute([]);
          if (window.location.pathname !== redirectTo) {
            router.replace(redirectTo);
          }
        }
      } finally {
        dispatch(setAuthLoading(false));
      }
    };

    validateSession();
  }, [token, user, isAuthenticated, dispatch, router]);

  return { loading: false };
}
