import { cookies } from "next/headers";

export async function getChildren() {
  const cookieStore = cookies();
  const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/children`, {
    headers: {
      Cookie: cookieStore.toString(),
    },
    cache: "no-store",
  });

  if (!res.ok) {
    console.error("❌ Error al obtener hijos:", await res.text());
    throw new Error("No se pudieron cargar los hijos");
  }

  const json = await res.json();
  return json.data;
}

export async function getEventCategories() {
  const cookieStore = cookies();
  const res = await fetch(
    `${process.env.NEXT_PUBLIC_API_URL}/api/calendar/categories`,
    {
      headers: {
        Cookie: cookieStore.toString(),
      },
      cache: "no-store",
    }
  );

  if (!res.ok) {
    console.error("❌ Error al obtener categorías:", await res.text());
    throw new Error("No se pudieron cargar las categorías");
  }

  const json = await res.json();
  return json.data;
}

export async function getEventById(id: string) {
  const cookieStore = cookies();
  const res = await fetch(
    `${process.env.NEXT_PUBLIC_API_URL}/api/events/${id}`,
    {
      headers: {
        Cookie: cookieStore.toString(),
      },
      cache: "no-store",
    }
  );

  if (!res.ok) return null;
  const json = await res.json();
  return json.data;
}
