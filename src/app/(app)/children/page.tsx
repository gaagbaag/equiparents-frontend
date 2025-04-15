"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useAppDispatch, useAppSelector } from "@/redux/hooks";
import { createChild } from "@/redux/thunks/childrenThunks";
import { setCurrentChild } from "@/redux/slices/childrenSlice";
import type { Child } from "@/types/child";
import { fetchAndSetSession } from "@/redux/thunks/fetchAndSetSession";
import RequireAuth from "@/components/auth/RequireAuth";

export default function AddChildPage() {
  const router = useRouter();
  const dispatch = useAppDispatch();

  const { user, isAuthenticated } = useAppSelector((state) => state.auth);
  const {
    current: child,
    loading,
    error,
  } = useAppSelector((state) => state.children);

  const [success, setSuccess] = useState(false);
  const [initialized, setInitialized] = useState(false);

  // 🔄 Sincroniza sesión si no hay cuenta parental
  useEffect(() => {
    if (!user?.parentalAccountId) {
      dispatch(fetchAndSetSession()).finally(() => setInitialized(true));
    } else {
      setInitialized(true);
    }
  }, [dispatch, user?.parentalAccountId]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!child?.firstName || !child.birthDate || !user?.parentalAccountId) {
      console.warn("⚠️ Datos incompletos para crear hijo/a.");
      return;
    }

    const childToSend: Child = {
      id: crypto.randomUUID(),
      firstName: child.firstName,
      birthDate: child.birthDate,
      parentalAccountId: user.parentalAccountId,
    };

    try {
      await dispatch(createChild(childToSend)).unwrap();
      setSuccess(true);
      setTimeout(() => router.push("/dashboard"), 1200);
    } catch (err: any) {
      console.error("❌ Error al crear hijo/a:", err);
    }
  };

  if (!initialized) {
    return <div className="p-4">⏳ Verificando sesión...</div>;
  }

  if (!isAuthenticated || !user?.parentalAccountId) {
    return (
      <div className="p-4 text-red-600">
        ⚠️ No tienes una cuenta parental activa. Por favor completa el
        onboarding.
      </div>
    );
  }

  return (
    <RequireAuth>
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
                dispatch(
                  setCurrentChild({
                    ...child,
                    firstName: e.target.value,
                  })
                )
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
                dispatch(
                  setCurrentChild({
                    ...child,
                    birthDate: e.target.value,
                  })
                )
              }
            />
          </div>

          <button type="submit" disabled={loading} className="btn btn-primary">
            {loading ? "Creando..." : "Agregar"}
          </button>
        </form>

        {error && <p className="text-red-600 mt-4">❌ {error}</p>}
        {success && (
          <p className="text-green-600 mt-4">
            ✅ Hijo/a agregado correctamente
          </p>
        )}
      </main>
    </RequireAuth>
  );
}
