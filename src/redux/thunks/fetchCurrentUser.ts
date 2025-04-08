import { createAsyncThunk } from "@reduxjs/toolkit";
import { RootState } from "../store";
import { setUser } from "../slices/authSlice";
import type { ExtendedAuthUser } from "@/types/auth";

type ValidRole = "parent" | "admin";

export const fetchCurrentUser = createAsyncThunk<
  void,
  void,
  { state: RootState }
>(
  "auth/fetchCurrentUser",
  async (_, { dispatch, getState, rejectWithValue }) => {
    const { token, isAuthenticated } = getState().auth;

    if (isAuthenticated && token?.trim()) {
      console.log("⚠️ [fetchCurrentUser] Omitido: sesión ya activa.");
      return;
    }

    try {
      console.log("🔄 [fetchCurrentUser] Iniciando sincronización...");

      const [sessionRes, tokenRes] = await Promise.all([
        fetch("/api/session"),
        fetch("/api/auth/token"),
      ]);

      if (!sessionRes.ok || !tokenRes.ok) {
        throw new Error("No se pudo obtener sesión o token");
      }

      const sessionData = await sessionRes.json();
      const tokenData = await tokenRes.json();

      const fetchedToken = tokenData.token || tokenData.accessToken;

      if (
        !fetchedToken ||
        typeof fetchedToken !== "string" ||
        !fetchedToken.trim()
      ) {
        console.warn("❌ Token inválido o ausente");
        return rejectWithValue("Token inválido o ausente");
      }

      // 🔐 Crear usuario si no existe
      console.log("📤 Enviando POST /auth/post-login");
      const createRes = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/api/auth/post-login`,
        {
          method: "POST",
          headers: {
            Authorization: `Bearer ${fetchedToken}`,
          },
        }
      );

      console.log("📥 POST /auth/post-login status:", createRes.status);

      if (createRes.status === 201) {
        const created = await createRes.json();
        console.log("✅ Usuario creado en DB:", created?.user?.id || created);
      } else if (createRes.status === 200) {
        console.log("ℹ️ Usuario ya existente, sin crear nuevo.");
      } else {
        const err = await createRes.json();
        console.warn("⚠️ Error al crear usuario:", err.message);
      }

      // 👤 Obtener datos del usuario
      console.log("📥 Enviando GET /api/users/me");
      const meRes = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/api/users/me`,
        {
          headers: {
            Authorization: `Bearer ${fetchedToken}`,
          },
        }
      );

      if (!meRes.ok) {
        console.error("❌ Usuario no encontrado en backend");
        throw new Error("Usuario no encontrado en backend");
      }

      const backendUser = await meRes.json();

      const roles = Array.isArray(sessionData.roles)
        ? sessionData.roles.filter((r: any): r is ValidRole =>
            ["admin", "parent"].includes(r)
          )
        : [];

      dispatch(setUser({ user: backendUser, token: fetchedToken, roles }));

      console.log("✅ Usuario sincronizado desde backend + cookie:", {
        id: backendUser.id,
        roles,
      });
    } catch (err: any) {
      console.error("❌ Error en fetchCurrentUser:", err.message);
      return rejectWithValue("Error al sincronizar sesión");
    }
  }
);

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
      console.warn("⚠️ Token no disponible en updateUserProfile");
      return rejectWithValue("Token no disponible");
    }

    try {
      console.log("📤 Enviando PUT /api/users/me con datos:", updatedData);

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

      const data: ExtendedAuthUser & { roles: ValidRole[] } = await res.json();

      dispatch(setUser({ user: data, token, roles: data.roles }));
      console.log("✅ Perfil actualizado y sincronizado:", {
        id: data.id,
        nombre: data.firstName,
        apellido: data.lastName,
        roles: data.roles,
      });

      return data;
    } catch (err: any) {
      console.error("❌ Error en updateUserProfile:", err.message);
      return rejectWithValue("Error al actualizar perfil");
    }
  }
);
