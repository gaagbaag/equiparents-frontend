"use client";

import { useEffect, useState } from "react";
import { useAppDispatch, useAppSelector } from "@/redux/hooks";
import { fetchCurrentUser } from "@/redux/thunks/fetchCurrentUser";

export default function RequireAuth({
  children,
}: {
  children: React.ReactNode;
}) {
  const dispatch = useAppDispatch();
  const token = useAppSelector((state) => state.auth.token);
  const isAuthenticated = useAppSelector((state) => state.auth.isAuthenticated);
  const [hasFetchedUser, setHasFetchedUser] = useState(false);

  useEffect(() => {
    if (!token && !isAuthenticated && !hasFetchedUser) {
      dispatch(fetchCurrentUser()).finally(() => setHasFetchedUser(true));
    }
  }, [dispatch, token, isAuthenticated, hasFetchedUser]);

  if (!hasFetchedUser) {
    return <div className="p-4 text-center">🔐 Cargando sesión...</div>;
  }

  if (!token || !isAuthenticated) {
    return (
      <div className="p-4 text-center text-red-600">
        ❌ No estás autenticado/a.
      </div>
    );
  }

  return <>{children}</>;
}
