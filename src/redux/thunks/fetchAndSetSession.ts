import { createAsyncThunk } from "@reduxjs/toolkit";
import { fetchSessionData } from "@/utils/fetchSession";
import { setUser } from "../slices/authSlice";
import type { AuthUser, ExtendedAuthUser } from "@/types";

interface SessionData {
  user: ExtendedAuthUser;
  accessToken?: string;
  roles: string[];
}

export const fetchAndSetSession = createAsyncThunk<
  SessionData,
  void,
  { rejectValue: string }
>("auth/fetchAndSetSession", async (_, { dispatch, rejectWithValue }) => {
  try {
    // Paso 1: Obtener sesión básica (cookie + accessToken)
    const session = await fetchSessionData();
    const token = session.accessToken;

    if (!token || !session.user) {
      return rejectWithValue("Sesión no válida o incompleta");
    }

    // Paso 2: Llamar al backend Express con JWT
    const backendRes = await fetch(
      `${process.env.NEXT_PUBLIC_API_URL}/api/users/me`,
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );

    if (!backendRes.ok) {
      console.warn("⚠️ No se pudo obtener el usuario desde el backend");
      return rejectWithValue("Usuario no encontrado en base de datos");
    }

    const backendUser = await backendRes.json();

    // Paso 3: Unificar datos
    const authUser: AuthUser = {
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
      address: backendUser.address,
      role: session.user.role || backendUser.role || null,
    };

    const safeRoles = (session.roles || []).filter(
      (r): r is "admin" | "parent" => r === "admin" || r === "parent"
    );

    // Paso 4: Guardar en Redux
    dispatch(
      setUser({
        user: authUser,
        token,
        roles: safeRoles,
      })
    );

    console.log("✅ Usuario final:", authUser);
    return {
      user: {
        ...session.user,
        ...backendUser,
      },
      accessToken: token,
      roles: safeRoles,
    };
  } catch (error) {
    console.error("❌ Error en fetchAndSetSession:", error);
    return rejectWithValue("Fallo al obtener la sesión");
  }
});
