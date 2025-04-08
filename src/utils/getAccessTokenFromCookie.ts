// utils/getAccessTokenFromCookie.ts
export async function getAccessTokenFromCookie(): Promise<string | null> {
  try {
    const res = await fetch("/api/auth/token");
    if (!res.ok) {
      console.warn("⚠️ No se pudo obtener token desde cookie");
      return null;
    }
    const { accessToken } = await res.json();
    return accessToken || null;
  } catch (err) {
    console.error("❌ Error al obtener token:", err);
    return null;
  }
}
