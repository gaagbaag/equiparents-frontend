import { configureStore } from "@reduxjs/toolkit";
import authReducer from "./authSlice";
import calendarReducer from "./calendarSlice";

const store = configureStore({
  reducer: {
    auth: authReducer,
    calendar: calendarReducer,
  },
});

export default store;
