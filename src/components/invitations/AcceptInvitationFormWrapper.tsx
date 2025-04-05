"use client";

import { useState } from "react";
import InvitationForm from "./InvitationForm";

export default function AcceptInvitationFormWrapper() {
  const [inviteCode, setInviteCode] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);

  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    setSuccess(false);

    try {
      const res = await fetch("/api/invitations/accept", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ code: inviteCode }),
      });

      if (!res.ok) {
        const { message } = await res.json();
        throw new Error(message || "Error al aceptar invitación");
      }

      setSuccess(true);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Error desconocido");
    } finally {
      setLoading(false);
    }
  };

  return (
    <InvitationForm
      inviteCode={inviteCode}
      setInviteCode={setInviteCode}
      onSubmit={onSubmit}
      loading={loading}
      error={error}
      success={success}
    />
  );
}
