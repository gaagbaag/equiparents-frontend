// src/app/children/page.tsx
"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useAppDispatch, useAppSelector } from "@/redux/hooks";
import { createChild } from "@/redux/thunks/childrenThunks";
import { setCurrentChild } from "@/redux/childrenSlice";
import type { Child } from "@/types/child";

export default function AddChildPage() {
  const router = useRouter();
  const dispatch = useAppDispatch();
  const {
    current: child,
    loading,
    error,
  } = useAppSelector((state) => state.children);

  const user = useAppSelector((state) => state.auth.user);
  const parentalAccountId = user?.parentalAccountId ?? "";

  const [success, setSuccess] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!child || !parentalAccountId) return;

    const childToSend: Child = {
      id: crypto.randomUUID(),
      firstName: child.firstName,
      birthDate: child.birthDate,
      parentalAccountId,
    };

    try {
      await dispatch(createChild(childToSend)).unwrap();
      setSuccess(true);
      setTimeout(() => router.push("/dashboard"), 1000);
    } catch (err: any) {
      console.error("Error al crear hijo/a:", err);
    }
  };

  return (
    <main className="container max-w-xl mx-auto">
      <h1 className="text-xl font-bold mb-4">👶 Agregar hijo/a</h1>

      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="form-group">
          <label htmlFor="firstName">Nombre *</label>
          <input
            id="firstName"
            type="text"
            value={child?.firstName || ""}
            required
            className="input"
            onChange={(e) =>
              dispatch(setCurrentChild({ ...child, firstName: e.target.value }))
            }
          />
        </div>

        <div className="form-group">
          <label htmlFor="birthDate">Fecha de nacimiento *</label>
          <input
            id="birthDate"
            type="date"
            value={child?.birthDate?.substring(0, 10) || ""}
            required
            className="input"
            onChange={(e) =>
              dispatch(setCurrentChild({ ...child, birthDate: e.target.value }))
            }
          />
        </div>

        <button type="submit" disabled={loading} className="btn btn-primary">
          {loading ? "Creando..." : "Agregar"}
        </button>
      </form>

      {error && <p className="text-red-600 mt-4">❌ {error}</p>}
      {success && (
        <p className="text-green-600 mt-4">✅ Hijo/a agregado correctamente</p>
      )}
    </main>
  );
}
