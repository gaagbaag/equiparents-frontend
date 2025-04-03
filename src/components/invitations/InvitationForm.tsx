// src/components/invitations/InvitationForm.tsx
"use client";

import styles from "@/styles/components/InvitationForm.module.css";

type InvitationFormProps = {
  inviteCode: string;
  setInviteCode: (value: string) => void;
  onSubmit: (e: React.FormEvent) => void;
  loading: boolean;
  error: string | null;
  success: boolean;
};

export default function InvitationForm({
  inviteCode,
  setInviteCode,
  onSubmit,
  loading,
  error,
  success,
}: InvitationFormProps) {
  return (
    <form onSubmit={onSubmit} className={styles.form}>
      <h2 className={styles.heading}>Unirme a una cuenta parental</h2>

      {error && <p className={styles.error}>{error}</p>}
      {success && (
        <p className={styles.success}>¡Invitación aceptada correctamente!</p>
      )}

      <label>
        Código de invitación:
        <input
          className={styles.input}
          type="text"
          name="inviteCode"
          value={inviteCode}
          onChange={(e) => setInviteCode(e.target.value.toUpperCase())}
          required
          autoFocus
          placeholder="Ej: 4F8D7C1A"
        />
      </label>

      <button type="submit" className={styles.button} disabled={loading}>
        {loading ? "Procesando..." : "Unirme a la familia"}
      </button>
    </form>
  );
}
