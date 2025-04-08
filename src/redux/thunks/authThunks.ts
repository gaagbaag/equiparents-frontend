import { createAsyncThunk } from "@reduxjs/toolkit";
import { setUser } from "../slices/authSlice";
import type { RootState } from "../store";
import type { ExtendedAuthUser, ValidRole } from "@/types/auth";

export const updateUserProfile = createAsyncThunk<
  ExtendedAuthUser,
  {
    firstName: string;
    lastName: string;
    phone: string;
    countryCode: string;
    countryDialCode: string;
    address: {
      country: string;
      state: string;
      city: string;
      zipCode: string;
      street: string;
      number: string;
      departmentNumber?: string;
    };
  },
  { state: RootState }
>(
  "auth/updateUserProfile",
  async (updatedData, { getState, dispatch, rejectWithValue }) => {
    const token = getState().auth.token;
    const roles = getState().auth.roles;

    if (!token?.trim()) {
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

      const data: ExtendedAuthUser = await res.json();
      dispatch(setUser({ user: data, token, roles }));

      console.log("✅ Perfil actualizado:", data);
      return data;
    } catch (err: any) {
      console.error("❌ Error en updateUserProfile:", err.message);
      return rejectWithValue("Error al actualizar perfil");
    }
  }
);
