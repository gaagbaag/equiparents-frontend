import { RootState } from "./store";

// 🔍 Selector para obtener el ID del calendario de la cuenta parental
export const selectCalendarId = (state: RootState): string | null => {
  const calendar = (state as any)?.calendar?.calendar;
  return calendar?.id ?? null;
};

// 👶 Selector para obtener los hijos asociados a la cuenta parental
export const selectChildren = (state: RootState) => {
  return state.parentalAccount.children ?? [];
};
