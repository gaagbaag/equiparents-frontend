// src/app/children/[id]/edit/page.tsx
"use client";

import { useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import { useAppDispatch, useAppSelector } from "@/redux/hooks";
import { fetchChildById, updateChild } from "@/redux/thunks/childrenThunks";
import { setCurrentChild } from "@/redux/childrenSlice";
import { withParentalAccount } from "@/utils/withParentalAccount";

export default function EditChildPage() {
  const params = useParams() as { id: string };
  const id = params.id;
  const router = useRouter();
  const dispatch = useAppDispatch();

  const {
    current: child,
    loading,
    error,
  } = useAppSelector((state) => state.children);
  const user = useAppSelector((state) => state.auth.user);

  useEffect(() => {
    dispatch(fetchChildById(id));
  }, [dispatch, id]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!child || !user) return;

    try {
      await dispatch(updateChild(withParentalAccount(child, user))).unwrap();
      router.push("/children");
    } catch (err: any) {
      console.error("Error al actualizar hijo/a:", err);
    }
  };

  if (loading) return <p>Cargando datos...</p>;
  if (!child) return <p>Error: hijo/a no encontrado/a</p>;

  return (
    <main className="container max-w-xl mx-auto">
      <h1 className="text-xl font-bold mb-4">✏️ Editar hijo/a</h1>

      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="form-group">
          <label htmlFor="firstName">Nombre *</label>
          <input
            id="firstName"
            type="text"
            value={child.firstName}
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
            value={child.birthDate?.substring(0, 10) || ""}
            required
            className="input"
            onChange={(e) =>
              dispatch(setCurrentChild({ ...child, birthDate: e.target.value }))
            }
          />
        </div>

        <button type="submit" className="btn btn-primary">
          Guardar cambios
        </button>
      </form>

      {error && <p className="text-red-600 mt-4">❌ {error}</p>}
    </main>
  );
}
