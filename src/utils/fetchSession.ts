// utils/fetchSession.ts
import type { ExtendedAuthUser } from "@/types/auth";

export interface SessionResponse {
  user: ExtendedAuthUser;
  accessToken: string;
  roles: string[];
}

export async function fetchSessionData(): Promise<SessionResponse> {
  const res = await fetch("/api/session");
  if (!res.ok) throw new Error("Sesión inválida");
  return res.json();
}
