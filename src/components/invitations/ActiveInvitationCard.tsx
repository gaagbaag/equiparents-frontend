"use client";

import { useEffect, useState } from "react";
import fetchWithToken from "@/utils/fetchWithToken";
import { handleFetchErrors } from "@/utils/handleFetchErrors";
import styles from "@/styles/components/ActiveInvitationCard.module.css";
import ExpiredMessage from "./ExpiredMessage";

interface Invitation {
  firstName: string;
  email: string;
  expiresAt: string;
}

export default function ActiveInvitationCard() {
  const [invitation, setInvitation] = useState<Invitation | null>(null);
  const [loading, setLoading] = useState(true);
  const [canceled, setCanceled] = useState(false);

  useEffect(() => {
    const fetchActive = async () => {
      try {
        const res = await fetchWithToken(
          `${process.env.NEXT_PUBLIC_API_URL}/api/invitations/active`
        );

        if (res.status === 404) {
          // No hay invitación activa, comportamiento esperado
          setInvitation(null); // Aquí seguimos con la lógica de mostrar "No hay invitación activa."
        } else {
          const data = await handleFetchErrors(res);
          setInvitation(data.data);
        }
      } catch (err: any) {
        console.warn("⚠️ No se pudo verificar invitación activa:", err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchActive();
  }, []);

  const handleCancel = async () => {
    try {
      const res = await fetchWithToken(
        `${process.env.NEXT_PUBLIC_API_URL}/api/invitations/active`,
        { method: "DELETE" }
      );
      if (res.ok) {
        setCanceled(true);
        setInvitation(null);
      }
    } catch (err: any) {
      console.error("❌ Error al cancelar invitación:", err.message);
    }
  };

  if (loading) return <p>Cargando...</p>;

  // Si no hay invitación activa, mostramos el mensaje correspondiente
  if (!invitation) {
    return (
      <div className={styles.card}>
        <p>No hay invitación activa.</p>{" "}
        {/* Mensaje cuando no hay invitación activa */}
      </div>
    );
  }

  if (canceled) {
    return (
      <div className={styles.card}>
        <ExpiredMessage
          name={invitation.firstName}
          email={invitation.email}
          expiredAt={invitation.expiresAt}
        />
      </div>
    );
  }

  const expiresAt = new Date(invitation.expiresAt);
  const daysLeft = Math.ceil(
    (expiresAt.getTime() - new Date().getTime()) / (1000 * 60 * 60 * 24)
  );
  const formattedDate = expiresAt.toLocaleDateString("es-CL", {
    weekday: "long",
    day: "numeric",
    month: "long",
    year: "numeric",
  });

  return (
    <div className={styles.card}>
      <p>
        Has enviado una invitación a <strong>{invitation.firstName}</strong> (
        {invitation.email}) que vence el <strong>{formattedDate}</strong> (
        {daysLeft} día{daysLeft !== 1 && "s"} restante
        {daysLeft !== 1 && "s"}).
      </p>
      <button className={styles.cancelButton} onClick={handleCancel}>
        Cancelar invitación
      </button>
    </div>
  );
}
