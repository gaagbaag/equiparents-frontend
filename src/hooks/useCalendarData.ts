"use client";

import { useEffect } from "react";
import { useDispatch } from "react-redux";
import {
  setEvents,
  setCategories,
  setChildren,
  setLoading,
  setError,
} from "@/redux/calendarSlice";

export default function useCalendarData() {
  const dispatch = useDispatch();

  useEffect(() => {
    const loadCalendarData = async () => {
      try {
        dispatch(setLoading(true));
        dispatch(setError(null));

        const tokenRes = await fetch("/api/auth/token");
        const { accessToken } = await tokenRes.json();

        const [eventRes, catRes, childRes] = await Promise.all([
          fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/events`, {
            headers: { Authorization: `Bearer ${accessToken}` },
          }),
          fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/categories`, {
            headers: { Authorization: `Bearer ${accessToken}` },
          }),
          fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/children`, {
            headers: { Authorization: `Bearer ${accessToken}` },
          }),
        ]);

        if (eventRes.ok) {
          const data = await eventRes.json();
          dispatch(setEvents(data.events || []));
        }

        if (catRes.ok) {
          const data = await catRes.json();
          dispatch(setCategories(data.categories || []));
        }

        if (childRes.ok) {
          const data = await childRes.json();
          dispatch(setChildren(data.children || []));
        }

        dispatch(setLoading(false));
      } catch (err) {
        dispatch(setError("Error al cargar datos del calendario"));
        dispatch(setLoading(false));
        console.error("❌ useCalendarData error:", err);
      }
    };

    loadCalendarData();
  }, [dispatch]);
}
