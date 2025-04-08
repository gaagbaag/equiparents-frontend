import { useSelector } from "react-redux";
import { RootState } from "@/redux/store";

export const useCalendarSelector = () => {
  return useSelector((state: RootState) => state.calendar);
};
