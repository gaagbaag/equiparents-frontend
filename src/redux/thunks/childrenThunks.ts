// src/redux/thunks/childrenThunks.ts
import { createAsyncThunk } from "@reduxjs/toolkit";
import { RootState } from "../store";
import type { Child } from "@/types/child";

export const createChild = createAsyncThunk<
  void,
  Child,
  { state: RootState; rejectValue: string }
>("children/createChild", async (child, { getState, rejectWithValue }) => {
  const token = getState().auth.token;
  if (!token) return rejectWithValue("Token no disponible");

  try {
    const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/children`, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify(child),
    });

    if (!res.ok) {
      const data = await res.json();
      throw new Error(data.message || "Error al crear hijo/a");
    }
  } catch (err: any) {
    return rejectWithValue(err.message);
  }
});

export const updateChild = createAsyncThunk<
  void,
  Child,
  { state: RootState; rejectValue: string }
>("children/updateChild", async (child, { getState, rejectWithValue }) => {
  const token = getState().auth.token;
  if (!token) return rejectWithValue("Token no disponible");

  try {
    const res = await fetch(
      `${process.env.NEXT_PUBLIC_API_URL}/api/children/${child.id}`,
      {
        method: "PUT",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify(child),
      }
    );

    if (!res.ok) {
      const data = await res.json();
      throw new Error(data.message || "Error al actualizar hijo/a");
    }
  } catch (err: any) {
    return rejectWithValue(err.message);
  }
});

export const fetchChildById = createAsyncThunk<
  Child,
  string,
  { state: RootState; rejectValue: string }
>("children/fetchChildById", async (id, { getState, rejectWithValue }) => {
  const token = getState().auth.token;
  if (!token) return rejectWithValue("Token no disponible");

  try {
    const res = await fetch(
      `${process.env.NEXT_PUBLIC_API_URL}/api/children/${id}`,
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );

    if (!res.ok) {
      const data = await res.json();
      throw new Error(data.message || "Error al obtener hijo/a");
    }

    const data = await res.json();
    return data as Child;
  } catch (err: any) {
    return rejectWithValue(err.message);
  }
});

export const fetchAllChildren = createAsyncThunk<
  Child[],
  void,
  { state: RootState; rejectValue: string }
>("children/fetchAllChildren", async (_, { getState, rejectWithValue }) => {
  const token = getState().auth.token;
  if (!token) return rejectWithValue("Token no disponible");

  try {
    const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/children`, {
      headers: { Authorization: `Bearer ${token}` },
    });

    if (!res.ok) throw new Error("No se pudieron obtener los hijos/as");

    const data = await res.json();
    return data as Child[];
  } catch (err: any) {
    return rejectWithValue(err.message);
  }
});

export const deleteChild = createAsyncThunk<
  string,
  string,
  { state: RootState; rejectValue: string }
>("children/deleteChild", async (childId, { getState, rejectWithValue }) => {
  const token = getState().auth.token;
  if (!token) return rejectWithValue("Token no disponible");

  try {
    const res = await fetch(
      `${process.env.NEXT_PUBLIC_API_URL}/api/children/${childId}`,
      {
        method: "DELETE",
        headers: { Authorization: `Bearer ${token}` },
      }
    );

    if (!res.ok) throw new Error("No se pudo eliminar el hijo/a");

    return childId;
  } catch (err: any) {
    return rejectWithValue(err.message);
  }
});
