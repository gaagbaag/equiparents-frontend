import { useEffect } from "react";
import { useDispatch } from "react-redux";
import { setUser, logout } from "@/redux/slices/authSlice";

export function useCheckSession() {
  const dispatch = useDispatch();

  useEffect(() => {
    const checkSession = async () => {
      try {
        const res = await fetch("/api/session");
        if (!res.ok) throw new Error("Sesión inválida");
        const data = await res.json();

        if (data?.user) {
          dispatch(
            setUser({
              user: data.user,
              token: data.accessToken || "",
              roles: data.roles || [],
            })
          );
        } else {
          dispatch(logout());
        }
      } catch (err) {
        dispatch(logout());
      }
    };

    checkSession();
  }, [dispatch]);
}
