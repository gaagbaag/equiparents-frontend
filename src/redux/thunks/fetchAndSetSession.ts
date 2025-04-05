// redux/thunks/fetchAndSetSession.ts
import { createAsyncThunk } from "@reduxjs/toolkit";
import { fetchSessionData } from "@/utils/fetchSession";
import { setUser } from "../slices/authSlice";
import type { ExtendedAuthUser } from "@/types/auth";

interface SessionData {
  user: ExtendedAuthUser;
  accessToken: string;
  roles: string[];
}

export const fetchAndSetSession = createAsyncThunk<
  SessionData,
  void,
  { rejectValue: string }
>("auth/fetchAndSetSession", async (_, { dispatch, rejectWithValue }) => {
  try {
    const data = await fetchSessionData();

    if (!data || !data.accessToken || !data.user) {
      return rejectWithValue("Sesión no válida o incompleta");
    }

    dispatch(
      setUser({
        user: data.user,
        token: data.accessToken,
        roles: data.roles || [],
      })
    );

    console.log("✅ Sesión cargada y almacenada en Redux");
    return data;
  } catch (error) {
    console.error("❌ Error al obtener sesión:", error);
    return rejectWithValue("Fallo al obtener la sesión");
  }
});
