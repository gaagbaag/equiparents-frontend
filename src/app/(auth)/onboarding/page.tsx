"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useAppDispatch, useAppSelector } from "@/redux/hooks";
import { fetchAndSetSession } from "@/redux/thunks/fetchAndSetSession";

export default function OnboardingPage() {
  const router = useRouter();
  const dispatch = useAppDispatch();

  const [checked, setChecked] = useState(false);

  const user = useAppSelector((state) => state.auth.user);

  useEffect(() => {
    dispatch(fetchAndSetSession())
      .unwrap()
      .then(() => setChecked(true))
      .catch((err) => {
        console.warn("⚠️ Error al sincronizar sesión:", err);
        setChecked(true);
      });
  }, [dispatch]);

  useEffect(() => {
    if (!checked || !user) return;

    if (user.role === "parent" && !user.parentalAccountId) {
      console.log("➡️ Redirigiendo a /onboarding/family");
      router.push("/onboarding/family");
    } else {
      console.log("✅ Usuario con cuenta parental o sin rol padre.");
      router.push("/dashboard"); // Puedes ajustar según tu flujo
    }
  }, [checked, user, router]);

  if (!checked) {
    return <div className="p-4 text-center">⏳ Verificando sesión...</div>;
  }

  return (
    <main className="page-center">
      <h1 className="heading-xl">Bienvenido a Equi·Parents</h1>
      <p>Inicia tu registro...</p>
    </main>
  );
}
