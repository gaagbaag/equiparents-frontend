import { fetchAllChildren } from "./childrenThunks";
import { createAsyncThunk } from "@reduxjs/toolkit";
import { RootState } from "../store";
import { setUser } from "../slices/authSlice";
import type { ExtendedAuthUser } from "@/types/auth";

// 🔄 Obtener usuario actual desde /api/session
export const fetchCurrentUser = createAsyncThunk<
  void,
  void,
  { state: RootState }
>(
  "auth/fetchCurrentUser",
  async (_, { dispatch, getState, rejectWithValue }) => {
    const state = getState();
    const token = state.auth.token;

    if (!token) {
      console.warn("❌ No hay token para obtener el usuario");
      return rejectWithValue("Token no disponible");
    }

    try {
      const res = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/api/users/me`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (!res.ok)
        throw new Error("No se pudo obtener el usuario desde backend");

      const data = await res.json();

      console.log("✅ Usuario desde backend:", data);

      dispatch(
        setUser({
          user: {
            ...data,
            sub: state.auth.user?.sub ?? "", // Conserva sub
          },
          token,
          roles: [data.role], // ← ¡desde base de datos!
        })
      );
    } catch (err: any) {
      console.error("❌ Error en fetchCurrentUser:", err.message);
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
