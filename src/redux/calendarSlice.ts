import { createSlice } from "@reduxjs/toolkit";

interface Child {
  id: string;
  firstName: string;
}

interface Category {
  id: string;
  name: string;
}

interface Event {
  id: string;
  title: string;
  start: string;
  end: string;
  description?: string;
  location?: string;
  category?: Category;
  children?: Child[];
}

const initialState = {
  events: [] as Event[],
  categories: [] as Category[],
  children: [] as Child[],
  loading: false,
  error: null as string | null,
};

const calendarSlice = createSlice({
  name: "calendar",
  initialState,
  reducers: {
    setEvents(state, action) {
      state.events = action.payload;
    },
    setCategories(state, action) {
      state.categories = action.payload;
    },
    setChildren(state, action) {
      state.children = action.payload;
    },
    setLoading(state, action) {
      state.loading = action.payload;
    },
    setError(state, action) {
      state.error = action.payload;
    },
    resetCalendarState() {
      return initialState;
    },
  },
});

export const {
  setEvents,
  setCategories,
  setChildren,
  setLoading,
  setError,
  resetCalendarState,
} = calendarSlice.actions;

export default calendarSlice.reducer;
