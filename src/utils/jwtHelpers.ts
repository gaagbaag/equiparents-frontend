// src/utils/jwtHelpers.ts
import { jwtDecode } from "jwt-decode";
import type { CustomJwtPayload } from "@/types/jwt";

export function getUserRoleFromToken(token: string): string | null {
  try {
    const decoded = jwtDecode<CustomJwtPayload>(token);
    const roles = decoded["https://equiparents.api/roles"];

    if (Array.isArray(roles) && roles.length > 0) {
      return roles[0]; // Si hay más de un rol, devuelve el primero
    }
    return null;
  } catch (error) {
    console.error("❌ Error al decodificar token:", error);
    return null;
  }
}

export function getParentalAccountIdFromToken(token: string): string | null {
  try {
    const decoded = jwtDecode<CustomJwtPayload>(token);
    return decoded["https://equiparents.api/parentalAccountId"] || null;
  } catch (error) {
    console.error("❌ Error al obtener parentalAccountId del token:", error);
    return null;
  }
}
