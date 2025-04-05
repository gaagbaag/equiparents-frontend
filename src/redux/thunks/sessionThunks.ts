// src/redux/thunks/sessionThunk.ts
import { createAsyncThunk } from "@reduxjs/toolkit";
import { setUser } from "../slices/authSlice";
import { fetchSessionData } from "@/utils/fetchSession";

export const fetchAndSetSession = createAsyncThunk(
  "auth/fetchAndSetSession",
  async (_, { dispatch }) => {
    try {
      const session = await fetchSessionData();
      console.log("🧾 Datos de sesión:", session);

      const { user, accessToken, roles } = session;

      if (!accessToken) {
        console.warn("⚠️ No se recibió accessToken desde /api/session.");
        return;
      }

      dispatch(
        setUser({
          user,
          token: accessToken,
          roles,
        })
      );
    } catch (err) {
      if (err instanceof Error) {
        console.error("❌ Error al obtener la sesión:", err.message);
      }
    }
  }
);
