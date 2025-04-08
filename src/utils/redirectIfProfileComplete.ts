import type { ExtendedAuthUser } from "@/types";
import type { AppRouterInstance } from "next/dist/shared/lib/app-router-context.shared-runtime";

export function redirectIfProfileComplete(
  user: ExtendedAuthUser,
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

  if (!profileComplete) {
    console.warn("⛔ Perfil incompleto, no se redirige.");
    return;
  }

  // Si es un administrador, lo redirigimos al dashboard de admin
  if (role === "admin") {
    console.log("✅ Redirigiendo a admin dashboard");
    router.push("/admin/dashboard");
    return;
  }

  // Solo los padres sin cuenta parental son redirigidos a /onboarding/family
  if (!parentalAccountId) {
    console.log(
      "⚠️ No hay cuenta parental aún, redirigiendo a onboarding/family"
    );
    router.push("/onboarding/family");
    return;
  }

  // Si existe cuenta parental, se redirige a dashboard parent
  console.log("✅ Redirigiendo a dashboard parent");
  router.push("/dashboard/parent");
}
