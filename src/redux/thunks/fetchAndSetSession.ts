// src/redux/thunks/fetchAndSetSession.ts
import { createAsyncThunk } from "@reduxjs/toolkit";
import { fetchSessionData } from "@/utils/fetchSession";
import { setUser } from "../slices/authSlice";
import type { ExtendedAuthUser, ValidRole } from "@/types/auth";

interface SessionData {
  user: ExtendedAuthUser;
  accessToken?: string;
  roles: ValidRole[];
}

export const fetchAndSetSession = createAsyncThunk<
  SessionData,
  void,
  { rejectValue: string }
>("auth/fetchAndSetSession", async (_, { dispatch, rejectWithValue }) => {
  try {
    console.log("🔄 Iniciando fetchAndSetSession...");

    const session = await fetchSessionData();
    if (!session?.accessToken || !session?.user) {
      console.warn("⚠️ Sesión no válida o incompleta:", session);
      return rejectWithValue("Sesión no válida o incompleta");
    }

    const token = session.accessToken;

    const postLoginRes = await fetch(
      `${process.env.NEXT_PUBLIC_API_URL}/api/auth/post-login`,
      {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );
    if (postLoginRes.status === 201) {
      const json = await postLoginRes.json();
      console.log("✅ Usuario creado automáticamente:", json?.user?.id);
    }

    const meRes = await fetch(
      `${process.env.NEXT_PUBLIC_API_URL}/api/users/me`,
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );
    if (!meRes.ok) {
      return rejectWithValue("Usuario no encontrado en base de datos");
    }

    const backendUser = await meRes.json();

    const roles: ValidRole[] = [];
    if (backendUser.role === "admin") roles.push("admin");
    if (backendUser.role === "parent") roles.push("parent");

    const user: ExtendedAuthUser = {
      ...session.user,
      ...backendUser,
    };

    dispatch(setUser({ user, token, roles }));

    console.log("🟢 Usuario sincronizado correctamente:", {
      id: user.id,
      roles,
      googleCalendarId: user.googleCalendarId,
      googleRefreshToken: user.googleRefreshToken,
      createdAt: user.createdAt,
      updatedAt: user.updatedAt,
    });

    return { user, accessToken: token, roles };
  } catch (error: any) {
    console.error("❌ Error en fetchAndSetSession:", error?.message || error);
    return rejectWithValue("Fallo al obtener la sesión");
  }
});
