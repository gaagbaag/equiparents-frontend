"use client";

import { useState } from "react";
import fetchWithToken from "@/utils/fetchWithToken";
import styles from "@/styles/components/InviteParentForm.module.css";

type Props = {
  onSuccess: () => void;
  onRefresh?: () => void; // ⬅️ función opcional para refrescar datos
};

export default function InviteParentForm({ onSuccess, onRefresh }: Props) {
  const [firstName, setFirstName] = useState("");
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setSuccess(false);
    setLoading(true);

    try {
      const res = await fetchWithToken(
        `${process.env.NEXT_PUBLIC_API_URL}/api/invitations`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ firstName, email }),
        }
      );

      if (!res.ok) {
        const data = await res.json();
        throw new Error(data.message || "Error al enviar invitación.");
      }

      setSuccess(true);

      // ⏱️ Dar un pequeño delay para mostrar mensaje de éxito
      setTimeout(() => {
        onSuccess(); // Cierra el modal
        onRefresh?.(); // Refresca datos en DashboardOverview
      }, 1500);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <form className={styles.form} onSubmit={handleSubmit}>
      <h3 className={styles.heading}>Invitar a otro progenitor</h3>

      {error && <p className={styles.error}>{error}</p>}
      {success && <p className={styles.success}>Invitación enviada ✅</p>}

      <label className={styles.label}>
        Nombre
        <input
          type="text"
          className={styles.input}
          value={firstName}
          required
          onChange={(e) => setFirstName(e.target.value)}
        />
      </label>

      <label className={styles.label}>
        Correo electrónico
        <input
          type="email"
          className={styles.input}
          value={email}
          required
          onChange={(e) => setEmail(e.target.value)}
        />
      </label>

      <div className={styles.actions}>
        <button type="submit" className={styles.button} disabled={loading}>
          {loading ? "Enviando..." : "Enviar invitación"}
        </button>
      </div>
    </form>
  );
}
