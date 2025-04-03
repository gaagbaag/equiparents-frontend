"use client";

import Link from "next/link";
import { useSelector } from "react-redux";
import { RootState } from "@/redux/store";
import { useState } from "react";
import { Menu, X } from "react-feather";

interface SidebarProps {
  open: boolean;
  setOpen: (value: boolean) => void;
}

export default function Sidebar({ open, setOpen }: SidebarProps) {
  const { roles, user, isAuthenticated } = useSelector(
    (state: RootState) => state.auth
  );

  const role = roles[0];
  const userAuth0Id = user?.sub;

  if (!isAuthenticated) return null;

  return (
    <>
      {/* Botón menú hamburguesa */}
      <button
        className="md:hidden fixed top-4 left-4 z-50 bg-white shadow p-2 rounded"
        onClick={() => setOpen(!open)}
      >
        {open ? <X size={20} /> : <Menu size={20} />}
      </button>

      {/* 🔲 Overlay de fondo en móvil */}
      {open && (
        <div
          className="fixed inset-0 bg-black bg-opacity-30 z-30 md:hidden"
          onClick={() => setOpen(false)}
        />
      )}

      {/* Panel lateral */}
      <aside
        className={`fixed top-0 left-0 h-full w-64 bg-gray-100 shadow-md p-4 z-40 transform transition-transform duration-200 ease-in-out 
        ${open ? "translate-x-0" : "-translate-x-full"} 
        md:translate-x-0 md:static md:block`}
      >
        <div className="text-lg font-bold mb-6">
          <Link href="/dashboard" onClick={() => setOpen(false)}>
            Equi·Parents
          </Link>
        </div>

        <nav className="flex flex-col gap-3">
          {role === "admin" && (
            <>
              <Link href="/admin/dashboard" onClick={() => setOpen(false)}>
                Panel Admin
              </Link>
              <Link href="/admin/users" onClick={() => setOpen(false)}>
                Usuarios
              </Link>
              {userAuth0Id && (
                <Link
                  href={`/edit-profile/${userAuth0Id}`}
                  onClick={() => setOpen(false)}
                >
                  Editar Perfil
                </Link>
              )}
            </>
          )}

          {role === "parent" && (
            <>
              <Link href="/dashboard" onClick={() => setOpen(false)}>
                Dashboard
              </Link>
              <Link href="/calendar" onClick={() => setOpen(false)}>
                Calendario
              </Link>
              <Link href="/children/manage" onClick={() => setOpen(false)}>
                Hijos/as
              </Link>
              <Link href="/calendar/overview" onClick={() => setOpen(false)}>
                Vista extendida
              </Link>
              {userAuth0Id && (
                <Link
                  href={`/edit-profile/${userAuth0Id}`}
                  onClick={() => setOpen(false)}
                >
                  Editar Perfil
                </Link>
              )}
            </>
          )}

          <Link
            href="/api/auth/logout"
            className="text-red-600 hover:underline"
            onClick={() => setOpen(false)}
          >
            Cerrar sesión
          </Link>
        </nav>
      </aside>
    </>
  );
}
