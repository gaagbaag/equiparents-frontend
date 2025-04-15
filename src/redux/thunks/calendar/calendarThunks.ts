// src/redux/thunks/calendar/calendarThunks.ts
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
} from "@/redux/slices/calendarSlice";

// Tipos globales
import type {
  CalendarEvent,
  CalendarCategory,
  CalendarTag,
} from "@/types/calendar";
import type { Child } from "@/types/child";
import type { ExtendedAuthUser } from "@/types/auth";

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
      const eventsJson = await resEvents.json();
      const events: CalendarEvent[] = eventsJson.events || [];

      // 2. Cargar categorías
      const resCategories = await fetchWithToken(
        `${process.env.NEXT_PUBLIC_API_URL}/api/categories?type=event`
      );
      const categoriesJson = await resCategories.json();
      const categories: CalendarCategory[] =
        categoriesJson.categories || categoriesJson.data || [];

      // 3. Cargar cuenta parental (incluye hijos y usuarios)
      const resAccount = await fetchWithToken(
        `${process.env.NEXT_PUBLIC_API_URL}/api/parental-accounts/my-account`
      );
      const accountData = await resAccount.json();
      const children: Child[] = accountData.children || [];
      const parents: ExtendedAuthUser[] = accountData.users || [];

      // 4. Cargar etiquetas
      const resTags = await fetchWithToken(
        `${process.env.NEXT_PUBLIC_API_URL}/api/tags?type=event`
      );
      const tagsJson = await resTags.json();
      const tags: CalendarTag[] = tagsJson.tags || [];

      // Actualizar el store
      dispatch(setEvents(events));
      dispatch(setCategories(categories));
      dispatch(setChildren(children));
      dispatch(setParents(parents));
      dispatch(setTags(tags));

      console.log("✅ Datos del calendario cargados correctamente.");
    } catch (err: any) {
      console.error("❌ Error al cargar datos del calendario:", err.message);
      dispatch(setError(err.message || "Error al cargar calendario"));
    } finally {
      dispatch(setLoading(false));
    }
  }
);
