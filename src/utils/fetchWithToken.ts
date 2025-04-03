// src/utils/fetchWithToken.ts

/**
 * ✅ Utiliza esta función en lugar de fetch() directo para acceder a rutas protegidas del backend.
 * Garantiza que el JWT esté presente en el header Authorization.
 */
export default async function fetchWithToken(
  endpoint: string,
  options: RequestInit = {}
): Promise<Response> {
  try {
    // 📡 Este endpoint recupera el token desde la cookie `appSession`.
    // Es seguro y útil en el cliente porque no puedes acceder directamente al JWT desde el contexto de App Router.
    const tokenRes = await fetch("/api/auth/token");

    if (!tokenRes.ok) {
      throw new Error("No se pudo obtener el token");
    }

    const { accessToken } = await tokenRes.json();

    if (!accessToken || accessToken.length < 10) {
      throw new Error("Token inválido o vacío");
    }

    // 🔐 Agrega el token al header Authorization
    // Este paso es crucial para que el backend reconozca al usuario autenticado. El middleware `checkJwt` espera este header.
    const headers = new Headers(options.headers);
    headers.set("Authorization", `Bearer ${accessToken}`);

    return fetch(endpoint, {
      ...options,
      headers,
      credentials: "include",
    });
  } catch (error) {
    if (process.env.NODE_ENV === "development") {
      console.warn("⚠️ fetchWithToken warning:", error); // warning en vez de error
    }
    throw error;
  }
}
