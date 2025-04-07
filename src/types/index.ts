// src/types/index.ts

// Dirección internacional estandarizada
export interface Address {
  country: string;
  state: string;
  city: string;
  street: string;
  number: string;
  zipCode?: string;
  departmentNumber?: string;
}

// Usuario base para Redux (Auth0 + datos del backend)
export interface AuthUser {
  sub: string;
  name: string;
  email: string;
  picture?: string;
  firstName?: string;
  lastName?: string;
  phone?: string;
  countryCode?: string;
  countryDialCode?: string;
  address?: Address;
  parentalAccountId?: string;
  role?: "parent" | "admin";
}

// Usuario extendido que incluye ID de base de datos (opcional)
export interface ExtendedAuthUser extends AuthUser {
  id?: string; // solo si ya fue creado en Prisma
}

// Usuario expuesto por el endpoint /api/session
export interface SessionUser {
  id?: string;
  email: string;
  firstName?: string;
  lastName?: string;
  phone?: string;
  countryCode?: string;
  countryDialCode?: string;
  address?: Address;
  parentalAccountId?: string;
  role?: "parent" | "admin";
}
