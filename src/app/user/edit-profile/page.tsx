"use client";

import React, { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

type User = {
  id: string;
  email: string;
  firstName: string;
  lastName: string;
};

export default function EditProfilePage() {
  const router = useRouter();
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [formData, setFormData] = useState({ firstName: "", lastName: "" });
  const [errorMessage, setErrorMessage] = useState("");

  // Cargar datos del usuario desde la sesión
  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const res = await fetch("/api/session"); // Suponiendo que esta ruta obtiene los datos del usuario
        const sessionData = await res.json();
        setUser(sessionData.user);
        setFormData({
          firstName: sessionData.user.firstName,
          lastName: sessionData.user.lastName,
        });
        setIsLoading(false);
      } catch (error) {
        console.error("Error al cargar los datos del usuario", error);
        setIsLoading(false);
      }
    };
    fetchUserData();
  }, []);

  // Manejar los cambios en el formulario
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  // Enviar los datos modificados al backend
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const tokenRes = await fetch("/api/auth/token");
      const { accessToken } = await tokenRes.json();

      const res = await fetch("/api/users/me", {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${accessToken}`,
        },
        body: JSON.stringify(formData),
      });

      if (!res.ok) {
        throw new Error("Error al actualizar los datos");
      }

      // Redirigir o mostrar mensaje de éxito
      router.push("/dashboard");
    } catch (error) {
      setErrorMessage("No se pudo actualizar el perfil. Intente nuevamente.");
      console.error("Error al actualizar perfil", error);
    }
  };

  if (isLoading) {
    return <div>Cargando...</div>;
  }

  if (!user) {
    return <div>No se pudo encontrar el usuario.</div>;
  }

  return (
    <main className="container">
      <h1>Editar Perfil</h1>
      <form onSubmit={handleSubmit}>
        <div>
          <label htmlFor="firstName">Nombre:</label>
          <input
            type="text"
            id="firstName"
            name="firstName"
            value={formData.firstName}
            onChange={handleChange}
            required
          />
        </div>

        <div>
          <label htmlFor="lastName">Apellido:</label>
          <input
            type="text"
            id="lastName"
            name="lastName"
            value={formData.lastName}
            onChange={handleChange}
            required
          />
        </div>

        {errorMessage && <div style={{ color: "red" }}>{errorMessage}</div>}

        <button type="submit">Guardar cambios</button>
      </form>
    </main>
  );
}
