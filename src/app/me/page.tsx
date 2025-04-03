"use client";

import { useEffect, useState } from "react";
import { useAppDispatch, useAppSelector } from "@/redux/hooks";
import {
  fetchCurrentUser,
  updateUserProfile,
} from "@/redux/thunks/fetchCurrentUser";

export default function UserProfile() {
  const dispatch = useAppDispatch();
  const { user, isAuthenticated, token } = useAppSelector(
    (state) => state.auth
  );

  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [email, setEmail] = useState("");

  useEffect(() => {
    console.log("📦 Dispatching fetchCurrentUser()");
    dispatch(fetchCurrentUser())
      .unwrap()
      .then(() => {
        console.log("✅ fetchCurrentUser completado");
      })
      .catch((err) => {
        console.error("❌ fetchCurrentUser error:", err);
      });
  }, [dispatch]);

  useEffect(() => {
    console.log("👤 useEffect: user =", user);
    if (user) {
      setFirstName(user.firstName || "");
      setLastName(user.lastName || "");
      setEmail(user.email || "");
    }
  }, [user]);

  console.log("🔐 Token en me:", token);
  console.log("🔐 Authenticated:", isAuthenticated);

  if (!isAuthenticated) return <p>⏳ Cargando datos del usuario...</p>;

  return (
    <div>
      <h1>Perfil de usuario</h1>
      <form
        onSubmit={(e) => {
          e.preventDefault();
          if (!firstName || !lastName) return;
          dispatch(updateUserProfile({ firstName, lastName, email }));
        }}
      >
        <div>
          <label>
            Nombre:
            <input
              type="text"
              value={firstName}
              onChange={(e) => setFirstName(e.target.value)}
              required
            />
          </label>
        </div>
        <div>
          <label>
            Apellido:
            <input
              type="text"
              value={lastName}
              onChange={(e) => setLastName(e.target.value)}
              required
            />
          </label>
        </div>
        <div>
          <label>
            Email:
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              disabled
            />
          </label>
        </div>
        <button type="submit">Guardar cambios</button>
      </form>
    </div>
  );
}
