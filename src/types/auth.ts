export type ValidRole = "parent" | "admin";

export interface Address {
  id: string;
  street?: string;
  number?: string;
  complement?: string;
  city?: string;
  state?: string;
  zipCode?: string;
  country?: string;
}

export interface AuthUser {
  sub: string; // ID de Auth0
  name: string; // Nombre completo desde Auth0
  email: string;
  picture?: string;

  // Campos adicionales completados por el usuario
  firstName?: string;
  lastName?: string;
  phone?: string;
  countryCode?: string;
  countryDialCode?: string;

  // Cuenta parental y Google
  parentalAccountId: string | null;
  googleRefreshToken?: string;
  googleCalendarId?: string;

  // Relaciones
  address?: Address | null;
  role: ValidRole | null;
}

export interface ExtendedAuthUser extends AuthUser {
  id: string; // ID en la base de datos (UUID generado por Prisma)
  createdAt?: string;
  updatedAt?: string;
}
