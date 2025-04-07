"use client";

import React, { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

type User = {
  id: string;
  email: string;
  firstName: string;
  lastName: string;
  role: { name: string };
  parentalAccount?: {
    id: string;
    name: string;
    children: { id: string }[];
  };
};

export default function AdminUsersPage() {
  const router = useRouter();
  const [users, setUsers] = useState<User[]>([]);
  const [isAdmin, setIsAdmin] = useState<boolean | null>(null);
  const [search, setSearch] = useState("");
  const [roleFilter, setRoleFilter] = useState<"all" | "admin" | "parent">(
    "all"
  );
  const [accountFilter, setAccountFilter] = useState<
    "all" | "with" | "without"
  >("all");
  const [currentPage, setCurrentPage] = useState(1);
  const usersPerPage = 10;

  useEffect(() => {
    const checkAdminAccess = async () => {
      try {
        const res = await fetch(
          `${process.env.NEXT_PUBLIC_API_URL}/api/session`,
          {
            credentials: "include",
          }
        );
        const data = await res.json();

        console.log("📡 Respuesta de /api/session:", data);

        if (data?.roles?.includes("admin")) {
          setIsAdmin(true);
        } else {
          setIsAdmin(false);
          console.warn("🚫 Usuario sin rol admin, redirigiendo...");
          router.push("/dashboard");
        }
      } catch (err) {
        console.error("❌ Error al verificar sesión:", err);
        setIsAdmin(false);
        router.push("/dashboard");
      }
    };

    checkAdminAccess();
  }, [router]);

  useEffect(() => {
    const fetchUsers = async () => {
      if (!isAdmin) return;

      try {
        const tokenRes = await fetch("/api/auth/token");
        const { accessToken } = await tokenRes.json();

        const res = await fetch(
          `${process.env.NEXT_PUBLIC_API_URL}/api/admin/users`,
          {
            headers: { Authorization: `Bearer ${accessToken}` },
          }
        );

        if (!res.ok) throw new Error("Error al cargar usuarios");

        const data = await res.json();
        setUsers(data.users);
      } catch (error) {
        console.error("❌ Error al obtener usuarios:", error);
      }
    };

    fetchUsers();
  }, [isAdmin]);

  const filteredUsers = users.filter((u) => {
    const nameMatch = `${u.firstName} ${u.lastName}`
      .toLowerCase()
      .includes(search.toLowerCase());
    const emailMatch = u.email.toLowerCase().includes(search.toLowerCase());
    const roleMatch = roleFilter === "all" || u.role.name === roleFilter;
    const accountMatch =
      accountFilter === "all" ||
      (accountFilter === "with" && u.parentalAccount) ||
      (accountFilter === "without" && !u.parentalAccount);
    return (nameMatch || emailMatch) && roleMatch && accountMatch;
  });

  const totalPages = Math.ceil(filteredUsers.length / usersPerPage);
  const paginatedUsers = filteredUsers.slice(
    (currentPage - 1) * usersPerPage,
    currentPage * usersPerPage
  );

  const exportToCSV = () => {
    const header = [
      "Nombre",
      "Email",
      "Rol",
      "Cuenta parental",
      "Cantidad hijos",
    ];
    const rows = filteredUsers.map((u) => [
      `${u.firstName} ${u.lastName}`,
      u.email,
      u.role.name,
      u.parentalAccount?.name || "—",
      u.parentalAccount?.children.length.toString() || "0",
    ]);
    const csvContent = [header, ...rows]
      .map((row) => row.map((v) => `"${v}"`).join(","))
      .join("\n");

    const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.setAttribute("download", "usuarios_equiparents.csv");
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const handleChangeRole = async (user: User) => {
    const nextRole = user.role.name === "admin" ? "parent" : "admin";
    if (!confirm(`¿Cambiar rol de ${user.email} a ${nextRole}?`)) return;

    const tokenRes = await fetch("/api/auth/token");
    const { accessToken } = await tokenRes.json();

    await fetch(
      `${process.env.NEXT_PUBLIC_API_URL}/api/admin/users/${user.id}/role`,
      {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${accessToken}`,
        },
        body: JSON.stringify({ newRole: nextRole }),
      }
    );

    location.reload();
  };

  const handleUnlink = async (user: User) => {
    if (!confirm(`¿Quitar a ${user.email} de su cuenta parental?`)) return;

    const tokenRes = await fetch("/api/auth/token");
    const { accessToken } = await tokenRes.json();

    await fetch(
      `${process.env.NEXT_PUBLIC_API_URL}/api/admin/users/${user.id}/unlink`,
      {
        method: "PATCH",
        headers: { Authorization: `Bearer ${accessToken}` },
      }
    );

    location.reload();
  };

  return (
    <main className="container">
      <h1>👥 Usuarios del sistema</h1>

      {/* Filtros */}
      <div>
        <input
          type="text"
          placeholder="🔍 Buscar por nombre o email..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />

        <select
          value={roleFilter}
          onChange={(e) => {
            setRoleFilter(e.target.value as "all" | "admin" | "parent");
            setCurrentPage(1);
          }}
        >
          <option value="all">Todos los roles</option>
          <option value="admin">Solo admin</option>
          <option value="parent">Solo parent</option>
        </select>

        <select
          value={accountFilter}
          onChange={(e) => {
            setAccountFilter(e.target.value as "all" | "with" | "without");
            setCurrentPage(1);
          }}
        >
          <option value="all">Todas las cuentas</option>
          <option value="with">Con cuenta parental</option>
          <option value="without">Sin cuenta parental</option>
        </select>

        <button onClick={exportToCSV}>📥 Exportar CSV</button>
      </div>

      {/* Tabla de usuarios */}
      <table>
        <thead>
          <tr>
            <th>Nombre</th>
            <th>Email</th>
            <th>Rol</th>
            <th>Cuenta parental</th>
            <th>Hijos</th>
            <th>Acciones</th>
          </tr>
        </thead>
        <tbody>
          {paginatedUsers.map((u) => (
            <tr key={u.id}>
              <td>
                {u.firstName} {u.lastName}
              </td>
              <td>{u.email}</td>
              <td>{u.role?.name}</td>
              <td>{u.parentalAccount?.name || "—"}</td>
              <td>{u.parentalAccount?.children.length || 0}</td>
              <td>
                <button onClick={() => handleChangeRole(u)}>🔄 Rol</button>
                <button onClick={() => handleUnlink(u)}>🧹 Quitar</button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      {/* Paginación */}
      {totalPages > 1 && (
        <div>
          <button
            onClick={() => setCurrentPage((prev) => Math.max(1, prev - 1))}
            disabled={currentPage === 1}
          >
            ◀ Anterior
          </button>
          <span>
            Página {currentPage} de {totalPages}
          </span>
          <button
            onClick={() =>
              setCurrentPage((prev) => Math.min(totalPages, prev + 1))
            }
            disabled={currentPage === totalPages}
          >
            Siguiente ▶
          </button>
        </div>
      )}
    </main>
  );
}
