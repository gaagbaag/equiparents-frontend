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
      console.log("📆 Eventos", eventsData);
      dispatch(setEvents(eventsData.events || []));

      // 2. Cargar categorías
      const resCategories = await fetchWithToken(
        `${process.env.NEXT_PUBLIC_API_URL}/api/categories?type=event`
      );
      const categoriesData = await resCategories.json();
      console.log("📁 Categorías", categoriesData);
      dispatch(setCategories(categoriesData.categories || []));

      // 3. Cargar hijos (desde cuenta parental)
      const resAccount = await fetchWithToken(
        `${process.env.NEXT_PUBLIC_API_URL}/api/parental-accounts/my-account`
      );
      const accountData = await resAccount.json();
      console.log("👧 Hijos", accountData);
      dispatch(setChildren(accountData.children || []));

      // 4. Cargar etiquetas (tags)
      const resTags = await fetchWithToken(
        `${process.env.NEXT_PUBLIC_API_URL}/api/tags?type=event`
      );
      const tagsData = await resTags.json();
      console.log("🏷️ Tags", tagsData);
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
