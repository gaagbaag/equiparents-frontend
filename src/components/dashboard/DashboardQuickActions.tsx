"use client";

import { useRouter } from "next/navigation";
import styles from "@/styles/components/DashboardQuickActions.module.css";

export default function DashboardQuickActions() {
  const router = useRouter();

  const actions = [
    {
      label: "Crear evento",
      emoji: "📅",
      href: "/calendar",
    },
    {
      label: "Registrar gasto",
      emoji: "💸",
      href: "/expenses",
    },
  ];

  return (
    <section className={styles.actionsSection}>
      <h2>⚡ Acciones rápidas</h2>
      <div className={styles.actionsGrid}>
        {actions.map((action) => (
          <button
            key={action.href}
            onClick={() => router.push(action.href)}
            className={styles.actionButton}
          >
            <span style={{ fontSize: "1.5rem" }}>{action.emoji}</span>
            {action.label}
          </button>
        ))}
      </div>
    </section>
  );
}
