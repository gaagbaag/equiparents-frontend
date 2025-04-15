// src/app/(auth)/page.tsx
"use client";

import Link from "next/link";

export default function AuthPage() {
  return (
    <main className="page-center text-center">
      <h1 className="heading-xl mb-4">Bienvenido a Equi·Parents</h1>
      <p className="mb-6 text-gray-600">
        Por favor, inicia sesión o regístrate
      </p>

      <div className="flex justify-center gap-4">
        <Link href="/api/auth/login" className="button button-primary">
          Iniciar sesión
        </Link>

        <Link
          href="/api/auth/login?screen_hint=signup"
          className="button button-secondary"
        >
          Registrarse
        </Link>
      </div>
    </main>
  );
}
