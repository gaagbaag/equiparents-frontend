// src/redux/store.ts
import { configureStore } from "@reduxjs/toolkit";
import { authReducer } from "./authSlice";
import calendarReducer from "./calendarSlice";
import invitationReducer from "./invitationSlice";
import childrenReducer from "./childrenSlice";

export const store = configureStore({
  reducer: {
    auth: authReducer,
    calendar: calendarReducer,
    invitation: invitationReducer,
    children: childrenReducer,
  },
});

// Tipos para usar en thunks y selectores
export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;

export default store;
