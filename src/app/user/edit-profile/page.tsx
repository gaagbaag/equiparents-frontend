"use client";

import Link from "next/link";
import { useSelector } from "react-redux";
import { RootState } from "@/redux/store";

export default function Header() {
  const { user, roles, isAuthenticated } = useSelector(
    (state: RootState) => state.auth
  );

  if (!isAuthenticated) return null;

  const role = roles[0];
  const userAuth0Id = user?.sub;

  return (
    <header className="w-full bg-white shadow-md mb-6 p-4 flex justify-between items-center">
      <h1 className="text-xl font-bold text-gray-800">
        <Link href="/dashboard">Equi·Parents</Link>
      </h1>

      <nav className="flex gap-4">
        {role === "admin" && (
          <>
            <Link href="/admin/dashboard" className="hover:underline">
              Panel de Administración
            </Link>
            <Link href="/admin/users" className="hover:underline">
              Usuarios
            </Link>
          </>
        )}

        {role === "parent" && (
          <>
            <Link href="/dashboard" className="hover:underline">
              Dashboard
            </Link>
            <Link href="/calendar" className="hover:underline">
              Calendario
            </Link>
            <Link href="/children/manage" className="hover:underline">
              Hijos/as
            </Link>
            <Link href="/calendar/overview" className="hover:underline">
              Vista extendida
            </Link>
          </>
        )}

        {userAuth0Id && (
          <Link
            href={`/edit-profile/${userAuth0Id}`}
            className="hover:underline"
          >
            Editar Perfil
          </Link>
        )}

        <Link href="/api/auth/logout" className="hover:underline">
          Cerrar
        </Link>
      </nav>
    </header>
  );
}
