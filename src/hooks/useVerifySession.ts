// src/hooks/useVerifySession.ts
import { useCallback } from "react";

interface VerifySessionOptions {
  onValidSession: (data: {
    user: any;
    accessToken: string;
    roles: string[];
  }) => void;
  onInvalidSession?: () => void;
  onError?: (err: unknown) => void;
}

export function useVerifySession(options: VerifySessionOptions) {
  const { onValidSession, onInvalidSession, onError } = options;

  const verifySession = useCallback(async () => {
    console.log("Ejecutando verifySession");
    try {
      const res = await fetch("/api/session");
      if (!res.ok) throw new Error("Error al obtener sesión");

      const { user, accessToken, roles } = await res.json();

      const isTokenValid =
        typeof accessToken === "string" && accessToken.trim() !== "";
      const isUserValid = user && typeof user === "object";
      const areRolesValid = Array.isArray(roles);

      if (!isUserValid || !isTokenValid || !areRolesValid) {
        onInvalidSession?.();
        return;
      }

      onValidSession({ user, accessToken, roles });
    } catch (err) {
      onError?.(err);
    }
  }, [onValidSession, onInvalidSession, onError]);

  return verifySession;
}
