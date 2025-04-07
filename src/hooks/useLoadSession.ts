"use client";

import { useEffect } from "react";
import { useDispatch } from "react-redux";
import { setUser, logout } from "@/redux/slices/authSlice";

export default function useLoadSession() {
  const dispatch = useDispatch();

  useEffect(() => {
    const loadSession = async () => {
      try {
        const res = await fetch(
          `${process.env.NEXT_PUBLIC_API_URL}/api/session`,
          {
            credentials: "include",
          }
        );
        if (!res.ok) throw new Error("No session");

        const data = await res.json();

        if (data?.user) {
          dispatch(
            setUser({
              user: data.user,
              token: data.accessToken,
              roles: data.roles || [],
            })
          );
        } else {
          dispatch(logout());
        }
      } catch (err) {
        console.warn("No se pudo cargar la sesión:", err);
        dispatch(logout());
      }
    };

    loadSession();
  }, [dispatch]);
}
