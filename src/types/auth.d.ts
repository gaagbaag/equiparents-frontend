export interface AuthUser {
  sub: string;
  email: string;
  name: string;
  picture?: string;
}

export interface ExtendedAuthUser {
  sub: string;
  name: string;
  email: string;
  picture?: string;
  firstName?: string;
  lastName?: string;
  phone?: string;
  countryCode?: string;
  address?: any; // ← agrega esto si usas dirección
  parentalAccountId?: string;
  role?: "parent" | "admin";
}
