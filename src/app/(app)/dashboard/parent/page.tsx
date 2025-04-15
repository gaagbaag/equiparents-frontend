// src/app/(app)/dashboard/parent/page.tsx
"use client";

import { useState } from "react";
import { useSearchParams } from "next/navigation";
import { useAppSelector } from "@/redux/hooks";

import InvitationForm from "@/components/invitations/InvitationForm";
import DashboardQuickActions from "@/components/dashboard/DashboardQuickActions";
import HistoryList from "@/components/HistoryList";
import DashboardOverview from "@/components/dashboard/DashboardOverview";
import GoogleSyncStatus from "@/components/calendar/GoogleSyncStatus";

export default function ParentDashboardPage() {
  const searchParams = useSearchParams();
  const showForm = searchParams?.get("action") === "new-invitation";

  const [inviteCode, setInviteCode] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);

  const handleInviteSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    setSuccess(false);

    try {
      const res = await fetch("/api/invitations/accept", {
        method: "POST",
        body: JSON.stringify({ inviteCode }),
        headers: { "Content-Type": "application/json" },
      });

      if (!res.ok) throw new Error("Error al aceptar la invitación");

      setSuccess(true);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Error desconocido");
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="container">
      <h1 className="text-xl font-semibold mb-4">🏠 Mi Dashboard Familiar</h1>

      <DashboardOverview />
      <GoogleSyncStatus />

      {showForm && (
        <div className="mb-8">
          <InvitationForm
            inviteCode={inviteCode}
            setInviteCode={setInviteCode}
            onSubmit={handleInviteSubmit}
            loading={loading}
            error={error}
            success={success}
          />
        </div>
      )}

      <DashboardQuickActions />

      <section className="mt-8">
        <h2 className="text-lg font-medium mb-2">📚 Historial reciente</h2>
        <HistoryList recentOnly />
      </section>
    </main>
  );
}
