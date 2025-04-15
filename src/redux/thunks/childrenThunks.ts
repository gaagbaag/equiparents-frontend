import { createAsyncThunk } from "@reduxjs/toolkit";
import type { RootState } from "../store";
import type { Child } from "@/types/child";

// ✅ Obtener todos los hijos de la cuenta parental
export const fetchAllChildren = createAsyncThunk<
  Child[],
  void,
  { state: RootState; rejectValue: string }
>("children/fetchAll", async (_, { getState, rejectWithValue }) => {
  const token = getState().auth.token;

  if (!token) {
    return rejectWithValue("Token no disponible.");
  }

  try {
    const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/children`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    const data = await res.json();

    if (!res.ok) {
      throw new Error(data.message || "Error al obtener hijos/as");
    }

    if (!Array.isArray(data.children)) {
      throw new Error("Respuesta inválida: se esperaba un array de hijos/as");
    }

    return data.children;
  } catch (err: any) {
    console.error("❌ Error en fetchAllChildren:", err);
    return rejectWithValue(err.message || "Error al obtener hijos/as");
  }
});

// ✅ Obtener hijo/a por ID
export const fetchChildById = createAsyncThunk<
  Child,
  string,
  { state: RootState; rejectValue: string }
>("children/fetchById", async (id, { getState, rejectWithValue }) => {
  const token = getState().auth.token;

  if (!token) {
    return rejectWithValue("Token no disponible.");
  }

  try {
    const res = await fetch(
      `${process.env.NEXT_PUBLIC_API_URL}/api/children/${id}`,
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );

    const data = await res.json();

    if (!res.ok) {
      throw new Error(data.message || "Error al obtener hijo/a");
    }

    return data.data as Child;
  } catch (err: any) {
    console.error("❌ Error en fetchChildById:", err);
    return rejectWithValue(err.message || "Error al obtener hijo/a");
  }
});

// ✅ Crear nuevo hijo/a
export const createChild = createAsyncThunk<
  Child,
  Child,
  { state: RootState; rejectValue: string }
>("children/create", async (childData, { getState, rejectWithValue }) => {
  const token = getState().auth.token;

  if (!token) {
    return rejectWithValue("Token no disponible.");
  }

  try {
    const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/children`, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify(childData),
    });

    const data = await res.json();

    if (!res.ok) {
      throw new Error(data.message || "Error al crear hijo/a");
    }

    return data as Child;
  } catch (err: any) {
    console.error("❌ Error en createChild:", err);
    return rejectWithValue(err.message || "Error al crear hijo/a");
  }
});

// ✅ Actualizar hijo/a existente
export const updateChild = createAsyncThunk<
  Child,
  Child,
  { state: RootState; rejectValue: string }
>("children/update", async (childData, { getState, rejectWithValue }) => {
  const token = getState().auth.token;

  if (!token) {
    return rejectWithValue("Token no disponible.");
  }

  try {
    const res = await fetch(
      `${process.env.NEXT_PUBLIC_API_URL}/api/children/${childData.id}`,
      {
        method: "PUT",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify(childData),
      }
    );

    const data = await res.json();

    if (!res.ok) {
      throw new Error(data.message || "Error al actualizar hijo/a");
    }

    return data as Child;
  } catch (err: any) {
    console.error("❌ Error en updateChild:", err);
    return rejectWithValue(err.message || "Error al actualizar hijo/a");
  }
});

// ✅ Eliminar hijo/a por ID
export const deleteChild = createAsyncThunk<
  void,
  string,
  { state: RootState; rejectValue: string }
>("children/delete", async (id, { getState, rejectWithValue }) => {
  const token = getState().auth.token;

  if (!token) {
    return rejectWithValue("Token no disponible.");
  }

  try {
    const res = await fetch(
      `${process.env.NEXT_PUBLIC_API_URL}/api/children/${id}`,
      {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );

    if (!res.ok) {
      const data = await res.json();
      throw new Error(data.message || "Error al eliminar hijo/a");
    }

    return;
  } catch (err: any) {
    console.error("❌ Error en deleteChild:", err);
    return rejectWithValue(err.message || "Error al eliminar hijo/a");
  }
});
