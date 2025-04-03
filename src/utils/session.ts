// src/utils/session.ts
export async function getSession() {
  try {
    const res = await fetch("/api/session");
    if (!res.ok) return null;
    return await res.json();
  } catch (error) {
    console.error("❌ Error al obtener la sesión:", error);
    return null;
  }
}
