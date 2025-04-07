import type { ExtendedAuthUser } from "@/types";

export interface SessionResponse {
  user: ExtendedAuthUser;
  accessToken?: string; // 🔁 ahora opcional
  roles: string[];
}

export async function fetchSessionData(): Promise<SessionResponse> {
  const res = await fetch("/api/session", {
    credentials: "include",
  });
  if (!res.ok) throw new Error("Sesión inválida");
  return res.json();
}
