// utils/redirectIfProfileComplete.ts

import type { ExtendedAuthUser } from "@/types"; // ✅ cambio aquí
import type { AppRouterInstance } from "next/dist/shared/lib/app-router-context.shared-runtime";

export function redirectIfProfileComplete(
  user: ExtendedAuthUser, // ✅ cambio aquí
  router: AppRouterInstance
) {
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
    typeof address.country === "string" &&
    address.country.length > 0 &&
    typeof address.state === "string" &&
    address.state.length > 0 &&
    typeof address.city === "string" &&
    address.city.length > 0 &&
    typeof address.street === "string" &&
    address.street.length > 0 &&
    typeof address.number === "string" &&
    address.number.length > 0;

  const profileComplete =
    typeof firstName === "string" &&
    firstName.length > 0 &&
    typeof lastName === "string" &&
    lastName.length > 0 &&
    typeof phone === "string" &&
    phone.length > 0 &&
    typeof countryCode === "string" &&
    countryCode.length > 0 &&
    addressComplete;

  console.log("📦 Datos de dirección recibidos:");
  console.log({
    address,
    addressComplete,
    campos: {
      country: address?.country,
      state: address?.state,
      city: address?.city,
      street: address?.street,
      number: address?.number,
    },
  });

  if (profileComplete) {
    if (role === "admin") {
      console.log("✅ Redirigiendo a admin dashboard");
      router.push("/admin/dashboard");
    } else if (parentalAccountId) {
      console.log("✅ Redirigiendo a dashboard parent");
      router.push("/dashboard/parent");
    } else {
      console.log("✅ Redirigiendo a onboarding family");
      router.push("/onboarding/family");
    }
  } else {
    console.warn("⛔ Perfil incompleto, no se redirige.");
  }
}
