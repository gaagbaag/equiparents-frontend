"use client";

import { useRouter } from "next/navigation";
import { useAppSelector } from "@/redux/hooks";
import { ExtendedAuthUser } from "@/types";
import { redirectIfProfileComplete } from "@/utils/redirectIfProfileComplete";

/**
 * Hook que redirige si el perfil del usuario está completo.
 */
export function useRedirectIfProfileComplete() {
  const user = useAppSelector((state) => state.auth.user) as ExtendedAuthUser;
  const router = useRouter();

  if (!user) return;

  redirectIfProfileComplete(user, router);
}
