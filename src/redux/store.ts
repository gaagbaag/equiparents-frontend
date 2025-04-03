// src/redux/store.ts
import { configureStore } from "@reduxjs/toolkit";
import { authReducer } from "./slices/authSlice";
import parentalAccountReducer from "./slices/parentalAccountSlice";
import calendarReducer from "./slices/calendarSlice";
import invitationReducer from "./slices/invitationSlice";
import childrenReducer from "./slices/childrenSlice";

export const store = configureStore({
  reducer: {
    auth: authReducer,
    parentalAccount: parentalAccountReducer,
    calendar: calendarReducer,
    invitation: invitationReducer,
    children: childrenReducer,
  },
});

// Tipos para usar en thunks y selectores
export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;

export default store;
