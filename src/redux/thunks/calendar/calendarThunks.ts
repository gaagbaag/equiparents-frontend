import { createAsyncThunk } from "@reduxjs/toolkit";
import fetchWithToken from "@/utils/fetchWithToken";
import {
  setEvents,
  setCategories,
  setChildren,
  setTags,
  setParents,
  setLoading,
  setError,
} from "../../slices/calendarSlice";

/**
 * Un único thunk para cargar eventos, categorías, hijos, etiquetas (tags) y padres
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

      // 3. Cargar la cuenta parental, que retorna hijos y además los usuarios asociados
      const resAccount = await fetchWithToken(
        `${process.env.NEXT_PUBLIC_API_URL}/api/parental-accounts/my-account`
      );
      const accountData = await resAccount.json();

      // 4. Cargar etiquetas
      const resTags = await fetchWithToken(
        `${process.env.NEXT_PUBLIC_API_URL}/api/tags?type=event`
      );
      const tagsData = await resTags.json();

      // Despachar la data al store:
      dispatch(setEvents(eventsData.events || []));
      dispatch(
        setCategories(
          categoriesData.categories ||
            categoriesData.data ||
            categoriesData ||
            []
        )
      );
      // Nota: El endpoint retorna la cuenta parental con la propiedad "users"
      dispatch(setChildren(accountData.children || []));
      dispatch(setParents(accountData.users || []));
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
