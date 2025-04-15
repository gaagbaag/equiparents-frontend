"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useAppDispatch, useAppSelector } from "@/redux/hooks";
import { fetchParentalAccount } from "@/redux/slices/parentalAccountSlice";
import { fetchAndSetSession } from "@/redux/thunks/fetchAndSetSession";
import { deleteChild } from "@/redux/thunks/childrenThunks";
import RequireAuth from "@/components/auth/RequireAuth";

export default function ManageChildrenPage() {
  const dispatch = useAppDispatch();
  const router = useRouter();

  const { user, isAuthenticated } = useAppSelector((state) => state.auth);
  const { children, status, error } = useAppSelector(
    (state) => state.parentalAccount
  );

  const [initialized, setInitialized] = useState(false);

  useEffect(() => {
    const syncSession = async () => {
      if (!user?.parentalAccountId) {
        await dispatch(fetchAndSetSession());
      }
      setInitialized(true);
    };

    syncSession();
  }, [dispatch, user?.parentalAccountId]);

  useEffect(() => {
    if (user?.parentalAccountId) {
      dispatch(fetchParentalAccount());
    }
  }, [dispatch, user?.parentalAccountId]);

  if (!initialized) {
    return <div className="p-4">⏳ Verificando sesión...</div>;
  }

  if (!isAuthenticated || !user?.parentalAccountId) {
    return (
      <div className="p-4 text-red-600">
        ⚠️ No tienes una cuenta parental activa. Completa el onboarding para
        acceder.
      </div>
    );
  }

  if (status === "loading") {
    return <div className="p-4">⏳ Cargando hijos/as...</div>;
  }

  if (!Array.isArray(children)) {
    return (
      <div className="text-red-600">
        ❌ Respuesta inválida: se esperaba un array de hijos/as
      </div>
    );
  }

  return (
    <RequireAuth>
      <main className="container max-w-3xl mx-auto">
        <h1 className="text-xl font-bold mb-6">👨‍👩‍👧‍👦 Hijos/as</h1>

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
                        confirm(
                          "¿Estás seguro que deseas eliminar este hijo/a?"
                        )
                      ) {
                        try {
                          await dispatch(deleteChild(child.id)).unwrap();
                          dispatch(fetchParentalAccount()); // refresca la lista
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
    </RequireAuth>
  );
}
