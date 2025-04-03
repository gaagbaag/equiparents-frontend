"use client";

import { useState, useEffect } from "react";
import { useParams } from "next/navigation"; // Usar useParams() para obtener el userAuth0Id de la URL

type User = {
  id: string;
  email: string;
  firstName: string;
  lastName: string;
};

export default function EditProfilePage() {
  const { userAuth0Id } = useParams(); // Usamos userAuth0Id desde la URL
  const [user, setUser] = useState<User | null>(null); // Estado para almacenar los datos del usuario

  useEffect(() => {
    const fetchUser = async () => {
      try {
        // Aseguramos que userAuth0Id esté disponible antes de hacer la solicitud
        if (userAuth0Id) {
          const res = await fetch(`/api/users/${userAuth0Id}`); // Realizamos la llamada a la API con userAuth0Id
          const data = await res.json();
          setUser(data); // Almacenamos el usuario en el estado
        }
      } catch (error) {
        console.error("Error al obtener los datos del usuario:", error);
      }
    };

    if (userAuth0Id) {
      fetchUser(); // Llamamos la API solo si el userAuth0Id está disponible
    }
  }, [userAuth0Id]); // Dependemos de userAuth0Id

  // Mostramos un mensaje de carga si no se ha cargado el usuario
  if (!user) {
    return <p>Cargando...</p>;
  }

  // Guardar cambios en el perfil del usuario
  const handleSave = async () => {
    if (user) {
      const response = await fetch(`/api/users/${user.id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(user),
      });

      if (response.ok) {
        alert("Perfil actualizado correctamente");
      } else {
        alert("Error al actualizar el perfil");
      }
    }
  };

  return (
    <div>
      <h1>Editar Perfil</h1>
      <form onSubmit={handleSave}>
        <div>
          <label>
            Nombre:
            <input
              type="text"
              value={user.firstName}
              onChange={(e) => setUser({ ...user, firstName: e.target.value })}
            />
          </label>
        </div>
        <div>
          <label>
            Apellido:
            <input
              type="text"
              value={user.lastName}
              onChange={(e) => setUser({ ...user, lastName: e.target.value })}
            />
          </label>
        </div>
        <div>
          <label>
            Email:
            <input
              type="email"
              value={user.email}
              onChange={(e) => setUser({ ...user, email: e.target.value })}
            />
          </label>
        </div>
        <button type="submit">Guardar cambios</button>
      </form>
    </div>
  );
}
