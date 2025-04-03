"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useDispatch } from "react-redux";
import { setUser } from "@/redux/slices/authSlice";

export default function OnboardingPage() {
  const router = useRouter();
  const dispatch = useDispatch();

  useEffect(() => {
    console.log("🚀 Entró a /onboarding");

    const checkSession = async () => {
      try {
        const res = await fetch("/api/session");
        const data = await res.json();
        console.log("🧾 Datos de sesión:", data);

        if (data?.user && data?.token && data?.roles) {
          dispatch(
            setUser({
              user: data.user,
              token: data.token,
              roles: data.roles,
            })
          );

          console.log("➡️ Redirigiendo a /onboarding/profile");
          router.push("/onboarding/profile");
        } else {
          console.warn("⚠️ No hay sesión activa o token incompleto");
        }
      } catch (err) {
        console.error("❌ Error al verificar sesión:", err);
      }
    };

    checkSession();
  }, [dispatch, router]);

  return (
    <main className="page-center">
      <h1 className="heading-xl">Bienvenido a Equi·Parents</h1>
      <p>Inicia tu registro...</p>
    </main>
  );
}
