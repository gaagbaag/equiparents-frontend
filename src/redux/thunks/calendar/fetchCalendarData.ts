import { createAsyncThunk } from "@reduxjs/toolkit";
import {
  setEvents,
  setCategories,
  setChildren,
  setTags,
  setLoading,
  setError,
} from "@/redux/slices/calendarSlice";

import fetchWithToken from "@/utils/fetchWithToken";

/**
 * 🔁 Carga eventos, categorías, hijos y etiquetas para el calendario familiar.
 */
export const fetchCalendarData = createAsyncThunk(
  "calendar/fetchCalendarData",
  async (_, { dispatch }) => {
    dispatch(setLoading(true));
    dispatch(setError(null));

    try {
      console.log("📡 Iniciando carga de datos del calendario...");

      const [eventRes, catRes, childRes, tagRes] = await Promise.all([
        fetchWithToken(
          `${process.env.NEXT_PUBLIC_API_URL}/api/calendar/events`
        ),
        fetchWithToken(
          `${process.env.NEXT_PUBLIC_API_URL}/api/categories?type=event`
        ),
        fetchWithToken(`${process.env.NEXT_PUBLIC_API_URL}/api/children`),
        fetchWithToken(
          `${process.env.NEXT_PUBLIC_API_URL}/api/tags?type=event`
        ),
      ]);

      // Logs para debug
      console.log("🧾 RAW RESPONSES:");
      console.log("📆 Eventos", await eventRes.clone().text());
      console.log("📁 Categorías", await catRes.clone().text());
      console.log("👧 Hijos", await childRes.clone().text());
      console.log("🏷️ Tags", await tagRes.clone().text());

      const [eventsData, categoriesData, childrenData, tagsData] =
        await Promise.all([
          eventRes.json(),
          catRes.json(),
          childRes.json(),
          tagRes.json(),
        ]);

      // Validación adicional por seguridad
      if (!eventsData?.events || !Array.isArray(eventsData.events)) {
        throw new Error("Respuesta inválida de eventos");
      }

      dispatch(setEvents(eventsData.events));
      dispatch(
        setCategories(categoriesData?.categories || categoriesData || [])
      );
      dispatch(setChildren(childrenData?.children || childrenData?.data || []));
      dispatch(setTags(tagsData?.tags || tagsData || []));

      console.log("✅ Datos del calendario cargados correctamente.");
    } catch (err) {
      dispatch(setError("Error al cargar datos del calendario"));
      console.error("❌ fetchCalendarData error:", err);
    } finally {
      dispatch(setLoading(false));
    }
  }
);
