import type { ExtendedAuthUser } from "@/types";
import type { AppRouterInstance } from "next/dist/shared/lib/app-router-context.shared-runtime";

/**
 * Redirige al usuario según el estado de su perfil y rol.
 * @param user Usuario autenticado
 * @param router Instancia de router de Next.js
 * @param verbose Habilita logs en consola para debugging
 */
export function redirectIfProfileComplete(
  user: ExtendedAuthUser,
  router: AppRouterInstance,
  verbose: boolean = false
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
    typeof address.city === "string" &&
    address.city.length > 0;

  const profileComplete =
    typeof firstName === "string" &&
    firstName.length > 0 &&
    typeof lastName === "string" &&
    lastName.length > 0 &&
    typeof phone === "string" &&
    phone.length > 0 &&
    typeof countryCode === "string" &&
    countryCode.length > 0;

  if (verbose) {
    console.log("🧪 Perfil:", {
      firstName,
      lastName,
      phone,
      countryCode,
      addressComplete,
      role,
      parentalAccountId,
    });
  }

  if (!profileComplete) {
    if (verbose)
      console.warn(
        "⛔ Perfil incompleto, permaneciendo en onboarding/profile."
      );
    return;
  }

  if (role === "admin") {
    if (verbose) console.log("🎩 Redirigiendo a /admin/dashboard");
    router.push("/admin/dashboard");
    return;
  }

  if (role === "parent" && !parentalAccountId) {
    if (verbose) console.log("👨‍👩‍👧 Redirigiendo a /onboarding/family");
    router.push("/onboarding/family");
    return;
  }

  if (role === "parent" && parentalAccountId) {
    if (verbose) console.log("✅ Redirigiendo a /dashboard/parent");
    router.push("/dashboard/parent");
    return;
  }

  // Caso por defecto de fallback
  if (verbose)
    console.warn(
      "❓ Rol desconocido o sin condiciones. Redirigiendo a /dashboard"
    );
  router.push("/dashboard");
}
