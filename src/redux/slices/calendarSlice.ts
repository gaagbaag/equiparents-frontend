// src/redux/slices/calendarSlice.ts
import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { RootState } from "../store";

// Tipos de entidad
export interface Child {
  id: string;
  firstName: string;
}

export interface Category {
  id: string;
  name: string;
}

export interface Tag {
  id: string;
  name: string;
}

export interface Event {
  id: string;
  title: string;
  start: string;
  end: string;
  description?: string;
  location?: string;
  category?: Category;
  children?: Child[];
}

// Estado inicial tipado
interface CalendarState {
  events: Event[];
  categories: Category[];
  children: Child[];
  tags: Tag[];
  loading: boolean;
  error: string | null;
}

const initialState: CalendarState = {
  events: [],
  categories: [],
  children: [],
  tags: [],
  loading: false,
  error: null,
};

// Slice
const calendarSlice = createSlice({
  name: "calendar",
  initialState,
  reducers: {
    setEvents: (state, action: PayloadAction<Event[]>) => {
      state.events = action.payload;
    },
    setCategories: (state, action: PayloadAction<Category[]>) => {
      state.categories = action.payload;
    },
    setChildren: (state, action: PayloadAction<Child[]>) => {
      state.children = action.payload;
    },
    setTags: (state, action: PayloadAction<Tag[]>) => {
      state.tags = action.payload;
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

export const {
  setEvents,
  setCategories,
  setChildren,
  setTags,
  setLoading,
  setError,
} = calendarSlice.actions;

export default calendarSlice.reducer;
