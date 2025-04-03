"use client";

import { useEffect, useState } from "react";
import styles from "@/styles/components/ExpiredInvitationCard.module.css";
import fetchWithToken from "@/utils/fetchWithToken";
import { format } from "date-fns";

interface ExpiredInvitation {
  email: string;
  createdAt: string;
  expiredAt: string;
}

export default function ExpiredInvitationCard() {
  const [expired, setExpired] = useState<ExpiredInvitation | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchExpired = async () => {
      try {
        const res = await fetchWithToken(
          `${process.env.NEXT_PUBLIC_API_URL}/api/invitations/expired`
        );

        if (!res.ok) {
          // Si es 401, 403 o 500, ignoramos silenciosamente
          console.warn(
            "⚠️ Error al consultar invitación caducada:",
            res.status
          );
          return;
        }

        const data = await res.json();
        if (data?.data) {
          setExpired(data.data);
        }
      } catch (err: any) {
        console.warn(
          "⚠️ No se pudo verificar invitación caducada:",
          err.message
        );
      } finally {
        setLoading(false);
      }
    };

    fetchExpired();
  }, []);

  if (loading || !expired) return null;

  const formattedDate = format(new Date(expired.expiredAt), "dd/MM/yyyy");

  return (
    <div className={styles.card}>
      <p>
        La invitación enviada a <strong>{expired.email}</strong> caducó el{" "}
        <strong>{formattedDate}</strong>.
      </p>
    </div>
  );
}
