"use client";

import { useEffect } from "react";
import { fetchCalendarData } from "@/redux/thunks/calendar/fetchCalendarData";
import { useAppDispatch } from "@/redux/hooks";

export default function useCalendarData() {
  const dispatch = useAppDispatch();

  useEffect(() => {
    dispatch(fetchCalendarData());
  }, [dispatch]);
}
