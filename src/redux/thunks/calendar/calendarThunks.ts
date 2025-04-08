import { createAsyncThunk } from "@reduxjs/toolkit";
import fetchWithToken from "@/utils/fetchWithToken";
import {
  setEvents,
  setCategories,
  setChildren,
  setTags,
  setLoading,
  setError,
} from "../../slices/calendarSlice";

/**
 * Un único thunk para cargar eventos, categorías, hijos y etiquetas (tags)
 * del calendario de manera coherente y sin duplicaciones.
 */
export const fetchCalendarData = createAsyncThunk(
  "calendar/fetchAll",
  async (_, { dispatch }) => {
    dispatch(setLoading(true));
    dispatch(setError(null));

    try {
      console.log("📡 Iniciando carga de datos del calendario...");

      // 1. Cargar eventos
      const resEvents = await fetchWithToken(
        `${process.env.NEXT_PUBLIC_API_URL}/api/calendar/events`
      );
      const eventsData = await resEvents.json();

      // 2. Cargar categorías
      const resCategories = await fetchWithToken(
        `${process.env.NEXT_PUBLIC_API_URL}/api/categories?type=event`
      );
      const categoriesData = await resCategories.json();

      // 3. Cargar hijos (usando la cuenta parental)
      const resAccount = await fetchWithToken(
        `${process.env.NEXT_PUBLIC_API_URL}/api/parental-accounts/my-account`
      );
      const accountData = await resAccount.json();

      // 4. Cargar etiquetas
      const resTags = await fetchWithToken(
        `${process.env.NEXT_PUBLIC_API_URL}/api/tags?type=event`
      );
      const tagsData = await resTags.json();

      // Asignamos al store
      // - Asumiendo que eventsData => { events: [...] }
      dispatch(setEvents(eventsData.events || []));

      // - Asumiendo que categoriesData => { categories: [...] }
      //   (o si tu backend retorna "data" o un array suelto, ajusta las or's).
      dispatch(
        setCategories(
          categoriesData.categories ||
            categoriesData.data ||
            categoriesData ||
            []
        )
      );

      // - Para hijos, la respuesta de my-account => { children: [...] }
      dispatch(setChildren(accountData.children || []));

      // - Para tags => { tags: [...] }
      dispatch(setTags(tagsData.tags || []));

      console.log("✅ Datos del calendario cargados correctamente.");
    } catch (err: any) {
      console.error("❌ Error al cargar datos del calendario:", err.message);
      dispatch(setError(err.message || "Error al cargar calendario"));
    } finally {
      dispatch(setLoading(false));
    }
  }
);
