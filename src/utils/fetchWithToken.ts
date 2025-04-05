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
    const tokenRes = await fetch("/api/auth/token");

    if (!tokenRes.ok) {
      throw new Error("No se pudo obtener el token");
    }

    const data = await tokenRes.json();
    const accessToken = data.token || data.accessToken; // ✅ Soporta ambas claves

    if (!accessToken || accessToken.length < 10) {
      throw new Error("Token inválido o vacío");
    }

    // 🔐 Agrega el token al header Authorization
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
