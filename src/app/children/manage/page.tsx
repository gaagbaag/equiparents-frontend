// src/app/children/manage/page.tsx
"use client";

import { useEffect } from "react";
import { useAppDispatch, useAppSelector } from "@/redux/hooks";
import { fetchAllChildren, deleteChild } from "@/redux/thunks/childrenThunks";
import { useRouter } from "next/navigation";

export default function ManageChildrenPage() {
  const dispatch = useAppDispatch();
  const router = useRouter();

  const {
    list: children,
    loading,
    error,
  } = useAppSelector((state) => state.children);
  const { token, isAuthenticated } = useAppSelector((state) => state.auth);

  useEffect(() => {
    console.log(
      "🔎 Estado: token =",
      token,
      "| isAuthenticated =",
      isAuthenticated
    );
    if (token && isAuthenticated) {
      dispatch(fetchAllChildren());
    }
  }, [dispatch, token, isAuthenticated]);

  if (!token || !isAuthenticated) {
    return <p className="p-4">⏳ Esperando autenticación...</p>;
  }

  return (
    <main className="container max-w-3xl mx-auto">
      <h1 className="text-xl font-bold mb-6">👨‍👩‍👧‍👦 Hijos/as</h1>

      {loading && <p>Cargando...</p>}
      {error && <p className="text-red-600">❌ {error}</p>}

      {children.length === 0 ? (
        <p>No hay hijos/as registrados aún.</p>
      ) : (
        <div className="space-y-4">
          {children.map((child) => (
            <div
              key={child.id}
              className="border border-gray-300 rounded p-4 flex justify-between items-center"
            >
              <div>
                <p className="font-semibold text-lg">{child.firstName}</p>
                {child.birthDate && (
                  <p className="text-sm text-gray-600">
                    Fecha nacimiento: {child.birthDate.substring(0, 10)}
                  </p>
                )}
              </div>
              <div className="flex gap-3">
                <button
                  className="btn btn-secondary"
                  onClick={() => router.push(`/children/${child.id}/edit`)}
                >
                  Editar
                </button>
                <button
                  className="btn btn-danger"
                  onClick={async () => {
                    if (
                      confirm("¿Estás seguro que deseas eliminar este hijo/a?")
                    ) {
                      try {
                        await dispatch(deleteChild(child.id)).unwrap();
                      } catch (err) {
                        console.error("Error al eliminar hijo/a:", err);
                      }
                    }
                  }}
                >
                  Eliminar
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </main>
  );
}
