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
    if (!session || !session.accessToken || !session.user) {
      console.warn("⚠️ Sesión no válida o incompleta:", session);
      return rejectWithValue("Sesión no válida o incompleta");
    }

    const token = session.accessToken;

    // Crear usuario si no existe
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

    // Cargar datos desde backend
    const backendRes = await fetch(
      `${process.env.NEXT_PUBLIC_API_URL}/api/users/me`,
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );

    if (!backendRes.ok) {
      return rejectWithValue("Usuario no encontrado en base de datos");
    }

    const backendUser = await backendRes.json();

    const roles = Array.isArray(session.roles)
      ? session.roles.filter((r): r is ValidRole =>
          ["admin", "parent"].includes(r)
        )
      : [];

    const user: ExtendedAuthUser = {
      id: backendUser.id,
      sub: session.user.sub,
      name: session.user.name,
      email: session.user.email,
      picture: session.user.picture,
      firstName: backendUser.firstName,
      lastName: backendUser.lastName,
      phone: backendUser.phone,
      countryCode: backendUser.countryCode,
      countryDialCode: backendUser.countryDialCode,
      parentalAccountId: backendUser.parentalAccountId,
      address: backendUser.address ?? null,
      role: backendUser.role,
      createdAt: backendUser.createdAt,
      updatedAt: backendUser.updatedAt,
    };

    dispatch(setUser({ user, token, roles }));

    console.log("🟢 Usuario sincronizado correctamente:", {
      id: user.id,
      roles,
    });

    return { user, accessToken: token, roles };
  } catch (error: any) {
    console.error("❌ Error en fetchAndSetSession:", error?.message || error);
    return rejectWithValue("Fallo al obtener la sesión");
  }
});
