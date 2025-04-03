// src/redux/thunks/fetchCurrentUser.ts
import { createAsyncThunk } from "@reduxjs/toolkit";
import { RootState } from "../store";
import { setUser } from "../slices/authSlice";
import type { ExtendedAuthUser } from "@/types/auth";

// thunk: fetchCurrentUser
export const fetchCurrentUser = createAsyncThunk<
  void,
  void,
  { state: RootState }
>(
  "auth/fetchCurrentUser",
  async (_, { dispatch, getState, rejectWithValue }) => {
    const { token, isAuthenticated } = getState().auth;

    if (isAuthenticated && token && token.trim() !== "") {
      console.log("⚠️ fetchCurrentUser cancelado: ya hay sesión.");
      return;
    }

    try {
      const res = await fetch("/api/session");
      if (!res.ok) throw new Error("No se pudo obtener la sesión");

      const { user, token: fetchedToken, roles } = await res.json();

      if (
        !user ||
        typeof fetchedToken !== "string" ||
        fetchedToken.trim() === "" ||
        !Array.isArray(roles)
      ) {
        return rejectWithValue("Sesión no válida");
      }

      console.log("✅ fetchCurrentUser completado", {
        token: fetchedToken,
        user,
        roles,
      });

      dispatch(setUser({ user, token: fetchedToken, roles }));
    } catch (err: any) {
      console.error("❌ Error al obtener la sesión:", err.message);
      return rejectWithValue(err.message);
    }
  }
);

// thunk: updateUserProfile
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
    const state = getState();
    const token = state.auth.token;

    if (!token) return rejectWithValue("Token no disponible");

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

      console.log("✅ fetchCurrentUser completado", {
        user: data,
        token,
        roles: data.roles,
      });

      dispatch(setUser({ user: data, token, roles: data.roles }));
      return data;
    } catch (err: any) {
      console.error("❌ Error en updateUserProfile:", err.message);
      return rejectWithValue(err.message);
    }
  }
);
