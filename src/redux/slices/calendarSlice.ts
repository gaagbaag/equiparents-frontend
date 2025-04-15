import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { RootState } from "../store";

// Tipos globales reutilizados
import type { Child } from "@/types/child";
import type { ExtendedAuthUser } from "@/types/auth";
import type {
  CalendarCategory,
  CalendarTag,
  CalendarEvent,
} from "@/types/calendar";

export interface CalendarState {
  events: CalendarEvent[];
  categories: CalendarCategory[];
  children: Child[];
  tags: CalendarTag[];
  parents: ExtendedAuthUser[]; // padres conectados a la cuenta
  loading: boolean;
  error: string | null;
}

const initialState: CalendarState = {
  events: [],
  categories: [],
  children: [],
  tags: [],
  parents: [],
  loading: false,
  error: null,
};

const calendarSlice = createSlice({
  name: "calendar",
  initialState,
  reducers: {
    setEvents: (state, action: PayloadAction<CalendarEvent[]>) => {
      state.events = action.payload;
    },
    setCategories: (state, action: PayloadAction<CalendarCategory[]>) => {
      state.categories = action.payload;
    },
    setChildren: (state, action: PayloadAction<Child[]>) => {
      state.children = action.payload;
    },
    setTags: (state, action: PayloadAction<CalendarTag[]>) => {
      state.tags = action.payload;
    },
    setParents: (state, action: PayloadAction<ExtendedAuthUser[]>) => {
      state.parents = action.payload;
    },
    setLoading: (state, action: PayloadAction<boolean>) => {
      state.loading = action.payload;
    },
    setError: (state, action: PayloadAction<string | null>) => {
      state.error = action.payload;
    },
  },
});

// Selectores recomendados
export const selectCalendarChildren = (state: RootState) =>
  state.calendar.children;

export const selectCalendarCategories = (state: RootState) =>
  state.calendar.categories;

export const selectCalendarTags = (state: RootState) => state.calendar.tags;

export const selectCalendarEvents = (state: RootState) => state.calendar.events;

export const selectCalendarParents = (state: RootState) =>
  state.calendar.parents;

// Acciones exportadas
export const {
  setEvents,
  setCategories,
  setChildren,
  setTags,
  setParents,
  setLoading,
  setError,
} = calendarSlice.actions;

export default calendarSlice.reducer;
