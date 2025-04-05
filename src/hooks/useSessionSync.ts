import { useEffect } from "react";
import { useAppDispatch, useAppSelector } from "@/redux/hooks";
import { fetchAndSetSession } from "@/redux/thunks/fetchAndSetSession";

export function useSessionSync() {
  const dispatch = useAppDispatch();

  const token = useAppSelector((state) => state.auth.token);
  const isAuthenticated = useAppSelector((state) => state.auth.isAuthenticated);

  useEffect(() => {
    if (!token || !isAuthenticated) {
      dispatch(fetchAndSetSession());
    }
  }, [dispatch, token, isAuthenticated]);
}
