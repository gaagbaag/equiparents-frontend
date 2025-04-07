// src/utils/session.ts
export async function getSession() {
  try {
    const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/session`, {
      credentials: "include",
    });
    if (!res.ok) return null;
    return await res.json();
  } catch (error) {
    console.error("❌ Error al obtener la sesión:", error);
    return null;
  }
}
