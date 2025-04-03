// src/components/InvitationForm.tsx
"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

export default function InvitationForm() {
  const router = useRouter();
  const [inviteCode, setInviteCode] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    setSuccess(null);

    try {
      // ✅ Obtener token JWT desde el servidor
      const tokenRes = await fetch("/api/auth/token");
      const { accessToken } = await tokenRes.json();

      // ✅ Enviar código con autorización
      const res = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/api/invitations/accept`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${accessToken}`,
          },
          body: JSON.stringify({ invitationCode: inviteCode }),
        }
      );

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.message || "Error al aceptar la invitación.");
      }

      setSuccess("Invitación aceptada correctamente. Redirigiendo...");
      setTimeout(() => router.push("/dashboard"), 1500);
    } catch (err: any) {
      setError(err.message || "Error inesperado");
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="invitation-form">
      <h2 className="heading-lg">Unirme a una cuenta parental</h2>

      {error && <p className="error-message">{error}</p>}
      {success && <p className="text-green-600 font-bold">{success}</p>}

      <label>
        Código de invitación:
        <input
          type="text"
          name="inviteCode"
          value={inviteCode}
          onChange={(e) => setInviteCode(e.target.value.toUpperCase())}
          required
          autoFocus
          placeholder="Ej: 4F8D7C1A"
        />
      </label>

      <button type="submit" disabled={loading}>
        {loading ? "Procesando..." : "Unirme a la familia"}
      </button>
    </form>
  );
}
