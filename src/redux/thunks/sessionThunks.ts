// src/redux/thunks/sessionThunk.ts
import { createAsyncThunk } from "@reduxjs/toolkit";
import { setUser } from "../slices/authSlice";
import { fetchSessionData } from "@/utils/fetchSession";
import { mapExtendedToAuthUser } from "@/utils/mapExtendedToAuthUser";

export const fetchAndSetSession = createAsyncThunk(
  "auth/fetchAndSetSession",
  async (_, { dispatch }) => {
    try {
      const session = await fetchSessionData();
      console.log("🧾 Datos de sesión:", session);

      const { user: extendedUser, accessToken, roles } = session;

      if (!accessToken) {
        console.warn("⚠️ No se recibió accessToken desde /api/session.");
        return;
      }

      const user = mapExtendedToAuthUser(extendedUser);

      const validRoles = (
        Array.isArray(roles)
          ? roles.filter(
              (r): r is "parent" | "admin" => r === "parent" || r === "admin"
            )
          : []
      ) as ("parent" | "admin")[];

      dispatch(
        setUser({
          user,
          token: accessToken,
          roles: validRoles,
        })
      );
    } catch (err) {
      if (err instanceof Error) {
        console.error("❌ Error al obtener la sesión:", err.message);
      }
    }
  }
);
