"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useAppDispatch } from "@/redux/hooks";
import { fetchAndSetSession } from "@/redux/thunks/fetchAndSetSession";

export default function OnboardingPage() {
  const router = useRouter();
  const dispatch = useAppDispatch();

  const [checked, setChecked] = useState(false); // ✅ estado para evitar loops o dobles renderizados

  useEffect(() => {
    console.log("🚀 Entró a /onboarding");

    const checkSession = async () => {
      try {
        await dispatch(fetchAndSetSession()).unwrap();
        console.log("➡️ Redirigiendo a /onboarding/profile");
        router.push("/onboarding/profile");
      } catch (err) {
        console.warn("⚠️ No hay sesión activa o falló sesión:", err);
      } finally {
        setChecked(true);
      }
    };

    checkSession();
  }, [dispatch, router]);

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
