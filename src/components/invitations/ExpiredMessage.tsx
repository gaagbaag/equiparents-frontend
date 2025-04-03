// src/components/invitations/ExpiredMessage.tsx

import styles from "@/styles/components/ExpiredInvitationCard.module.css";

type ExpiredMessageProps = {
  name: string;
  email: string;
  expiredAt: string;
};

export default function ExpiredMessage({
  name,
  email,
  expiredAt,
}: ExpiredMessageProps) {
  const formattedDate = new Date(expiredAt).toLocaleDateString("es-CL", {
    day: "2-digit",
    month: "long",
    year: "numeric",
  });

  return (
    <p className={styles.message}>
      La invitación enviada a <strong>{name}</strong> ({email}) caducó el{" "}
      <strong>{formattedDate}</strong>.
    </p>
  );
}
