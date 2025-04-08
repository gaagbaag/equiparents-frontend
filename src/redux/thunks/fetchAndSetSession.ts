// fetchAndSetSession.ts
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

    // 1. Obtenemos la sesión local (por ejemplo, de Auth0)
    const session = await fetchSessionData();
    if (!session?.accessToken || !session?.user) {
      console.warn("⚠️ Sesión no válida o incompleta:", session);
      return rejectWithValue("Sesión no válida o incompleta");
    }

    const token = session.accessToken;

    // 2. Notificamos al backend para crear/actualizar el usuario
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

    // 3. Obtenemos datos concretos desde /api/users/me en tu backend
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

    // 4. Transformamos la propiedad "role" en un array.
    //    Ej. si backendUser.role === "admin", => roles = ["admin"]
    const roles: ValidRole[] = [];
    if (backendUser.role === "admin") {
      roles.push("admin");
    } else if (backendUser.role === "parent") {
      roles.push("parent");
    }

    // 5. Construimos el user final
    const user: ExtendedAuthUser = {
      id: backendUser.id,
      sub: session.user.sub, // del ID token / claims
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
      role: backendUser.role, // "admin" o "parent"
      createdAt: backendUser.createdAt,
      updatedAt: backendUser.updatedAt,
    };

    // 6. Guardamos todo en el store (user + token + roles=["admin"] o ["parent"])
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
