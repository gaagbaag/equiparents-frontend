import { AuthUser } from "@/types";

export function isProfileComplete(user: AuthUser): boolean {
  return !!(
    user.firstName &&
    user.lastName &&
    user.phone &&
    user.countryCode &&
    user.countryDialCode &&
    user.address?.city &&
    user.address?.street &&
    user.address?.number
  );
}
