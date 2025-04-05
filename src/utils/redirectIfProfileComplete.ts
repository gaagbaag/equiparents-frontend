"use client";

import { useRouter } from "next/navigation";
import { useAppSelector } from "@/redux/hooks";
import { ExtendedAuthUser } from "@/types/auth";

/**
 * Redirige según el estado del perfil y la cuenta parental.
 * Puedes pasar un usuario explícitamente o usar el de Redux.
 */
export function redirectIfProfileComplete(userArg?: ExtendedAuthUser) {
  const router = useRouter();
  const user =
    userArg || (useAppSelector((state) => state.auth.user) as ExtendedAuthUser);

  if (!user) return;

  const {
    firstName,
    lastName,
    phone,
    countryCode,
    address,
    role,
    parentalAccountId,
  } = user;

  const addressComplete =
    address &&
    address.country &&
    address.state &&
    address.city &&
    address.street &&
    address.number;

  const profileComplete =
    firstName && lastName && phone && countryCode && addressComplete;

  if (profileComplete) {
    if (role === "admin") {
      router.push("/admin/dashboard");
    } else if (parentalAccountId) {
      router.push("/dashboard");
    } else {
      router.push("/onboarding/family");
    }
  }
}
