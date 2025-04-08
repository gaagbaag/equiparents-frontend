"use client";

import type { RootState, AppDispatch } from "@/redux/store";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { useDispatch, useSelector } from "react-redux";
import {
  startAccept,
  acceptSuccess,
  acceptFailure,
} from "@/redux/slices/invitationSlice";
import { fetchParentalAccount } from "@/redux/slices/parentalAccountSlice";
import InvitationForm from "@/components/invitations/InvitationForm";

export default function InvitePage() {
  const router = useRouter();
  const dispatch = useDispatch<AppDispatch>();

  // 1) Obtenemos el token del state, igual que en “family” o “profile”
  const { accepted, error, loading } = useSelector(
    (state: RootState) => state.invitation
  );
  const { token } = useSelector((state: RootState) => state.auth);
  // Por ejemplo, tu slice `auth` podría haber algo como:
  // initialState = { token: null, user: null, ... }

  const [inviteCode, setInviteCode] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    // Evitas fallo si no hay token
    if (!token) {
      dispatch(acceptFailure("No hay token: inicia sesión antes de aceptar."));
      return;
    }

    dispatch(startAccept());
    setInviteCode("");

    try {
      const res = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/api/invitations/accept`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            // 2) Añadimos la cabecera Authorization con Bearer
            Authorization: `Bearer ${token}`,
          },
          credentials: "include", // Si tu proyecto necesita cookies en la misma llamada
          body: JSON.stringify({ invitationCode: inviteCode }),
        }
      );

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.message || "Error al aceptar la invitación");
      }

      dispatch(acceptSuccess(inviteCode));
      dispatch(fetchParentalAccount());

      setTimeout(() => {
        router.push("/dashboard");
      }, 1500);
    } catch (err: any) {
      const errorMessage = err.message || "Error desconocido";
      dispatch(acceptFailure(errorMessage));
    }
  };

  return (
    <main className="container page-center">
      <h2 className="heading-lg mb-4">Aceptar invitación</h2>
      <InvitationForm
        inviteCode={inviteCode}
        setInviteCode={setInviteCode}
        onSubmit={handleSubmit}
        loading={loading}
        error={error}
        success={accepted}
      />
    </main>
  );
}
