"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { useAppDispatch, useAppSelector } from "@/redux/hooks";
import { fetchChildById, updateChild } from "@/redux/thunks/childrenThunks";
import { setCurrentChild } from "@/redux/slices/childrenSlice";
import { withParentalAccount } from "@/utils/withParentalAccount";
import RequireAuth from "@/components/auth/RequireAuth";

export default function EditChildPage() {
  const { id } = useParams() as { id: string };
  const router = useRouter();
  const dispatch = useAppDispatch();

  const {
    current: child,
    loading,
    error,
  } = useAppSelector((state) => state.children);
  const user = useAppSelector((state) => state.auth.user);

  const [submitError, setSubmitError] = useState("");

  useEffect(() => {
    if (id) {
      dispatch(fetchChildById(id));
    }
  }, [dispatch, id]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitError("");

    if (!child || !user) return;

    try {
      await dispatch(updateChild(withParentalAccount(child, user))).unwrap();
      router.push("/children/manage");
    } catch (err: any) {
      console.error("❌ Error al actualizar hijo/a:", err);
      setSubmitError(err.message || "Error al actualizar hijo/a");
    }
  };

  if (loading) return <p className="p-4">⏳ Cargando datos del hijo/a...</p>;
  if (!child)
    return <p className="p-4 text-red-600">❌ Hijo/a no encontrado/a</p>;

  return (
    <RequireAuth>
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
              value={child.birthDate?.substring(0, 10) || ""}
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

          <button type="submit" className="btn btn-primary">
            Guardar cambios
          </button>
        </form>

        {(error || submitError) && (
          <p className="text-red-600 mt-4">❌ {submitError || error}</p>
        )}
      </main>
    </RequireAuth>
  );
}
