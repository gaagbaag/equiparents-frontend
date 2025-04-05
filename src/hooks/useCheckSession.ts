// src/hooks/useCheckSession.ts
"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useAppDispatch, useAppSelector } from "@/redux/hooks";
import { setUser } from "@/redux/slices/authSlice";
import { getRedirectRoute } from "@/utils/getRedirectRoute";

export function useCheckSession() {
  const router = useRouter();
  const dispatch = useAppDispatch();
  const { token } = useAppSelector((state) => state.auth);

  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const validateSession = async () => {
      if (!token) {
        console.warn("⚠️ No token encontrado, redirigiendo a login.");
        router.push("/api/auth/login");
        return;
      }

      try {
        const sessionRes = await fetch("/api/session", {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        if (!sessionRes.ok) {
          throw new Error("No se pudo validar la sesión");
        }

        const sessionData = await sessionRes.json();
        const { user, roles = [] } = sessionData;

        if (user) {
          dispatch(setUser({ user, token, roles }));
        } else {
          throw new Error("Usuario no encontrado en la sesión");
        }
      } catch (err) {
        console.error("❌ Error al validar sesión:", err);
        router.push(getRedirectRoute([])); // fallback
      } finally {
        setLoading(false);
      }
    };

    validateSession();
  }, [token, dispatch, router]);

  return { loading };
}
