import { createAsyncThunk } from "@reduxjs/toolkit";
import { RootState } from "../store";
import { setUser } from "../slices/authSlice";
import type { ExtendedAuthUser } from "@/types/auth";

// ✅ fetchCurrentUser
export const fetchCurrentUser = createAsyncThunk<
  void,
  void,
  { state: RootState }
>(
  "auth/fetchCurrentUser",
  async (_, { dispatch, getState, rejectWithValue }) => {
    const { token, isAuthenticated } = getState().auth;

    if (isAuthenticated && token?.trim()) {
      console.log("⚠️ fetchCurrentUser omitido: ya existe sesión válida.");
      return;
    }

    try {
      const [sessionRes, tokenRes] = await Promise.all([
        fetch("/api/session"),
        fetch("/api/auth/token"),
      ]);

      if (!sessionRes.ok || !tokenRes.ok) {
        throw new Error("No se pudo obtener sesión o token");
      }

      const sessionData = await sessionRes.json();
      const tokenData = await tokenRes.json();

      const { user } = sessionData;
      const roles = Array.isArray(sessionData.roles) ? sessionData.roles : [];
      const fetchedToken = tokenData.token || tokenData.accessToken;

      if (!user || typeof fetchedToken !== "string" || !fetchedToken.trim()) {
        return rejectWithValue("⚠️ Sesión inválida o token ausente.");
      }

      dispatch(setUser({ user, token: fetchedToken, roles }));
      console.log("✅ Sesión sincronizada desde cookie:", { user, roles });
    } catch (err: any) {
      console.error("❌ Error en fetchCurrentUser:", err.message);
      return rejectWithValue("Error al sincronizar sesión");
    }
  }
);

// ✅ updateUserProfile
export const updateUserProfile = createAsyncThunk<
  ExtendedAuthUser,
  {
    firstName: string;
    lastName: string;
    email?: string;
  },
  { state: RootState }
>(
  "auth/updateUserProfile",
  async (updatedData, { getState, dispatch, rejectWithValue }) => {
    const { token } = getState().auth;

    if (!token || !token.trim()) {
      return rejectWithValue("Token no disponible");
    }

    try {
      const res = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/api/users/me`,
        {
          method: "PUT",
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
          body: JSON.stringify(updatedData),
        }
      );

      if (!res.ok) {
        const error = await res.json();
        throw new Error(error.message || "Error al actualizar perfil");
      }

      const data: ExtendedAuthUser & { roles: string[] } = await res.json();

      dispatch(setUser({ user: data, token, roles: data.roles }));
      console.log("✅ Perfil actualizado y sesión sincronizada:", data);

      return data;
    } catch (err: any) {
      console.error("❌ Error en updateUserProfile:", err.message);
      return rejectWithValue("Error al actualizar perfil");
    }
  }
);
