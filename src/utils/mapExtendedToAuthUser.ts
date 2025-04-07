import type { ExtendedAuthUser, AuthUser } from "@/types";

/**
 * Convierte un ExtendedAuthUser (Auth0 + backend) a AuthUser para Redux.
 */
export function mapExtendedToAuthUser(user: ExtendedAuthUser): AuthUser {
  const {
    sub,
    name,
    email,
    picture,
    firstName,
    lastName,
    phone,
    countryCode,
    countryDialCode,
    parentalAccountId,
    address,
    role,
  } = user;

  return {
    sub,
    name,
    email,
    picture,
    firstName,
    lastName,
    phone,
    countryCode,
    countryDialCode,
    parentalAccountId,
    address,
    role,
  };
}
