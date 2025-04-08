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

export type ValidRole = "parent" | "admin";

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
  parentalAccountId?: string;
  address?: Address | null;
  role?: ValidRole | null;
}

export interface ExtendedAuthUser extends AuthUser {
  id: string;
  createdAt?: string;
  updatedAt?: string;
}
