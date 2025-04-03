// app/dashboard/parent/page.tsx
"use client";

import { useSearchParams } from "next/navigation";
import { useState } from "react";
import HistoryList from "@/components/HistoryList";
import DashboardOverview from "@/components/dashboard/DashboardOverview";
import DashboardQuickActions from "@/components/dashboard/DashboardQuickActions";
import ActiveInvitationCard from "@/components/invitations/ActiveInvitationCard";
import ExpiredInvitationCard from "@/components/invitations/ExpiredInvitationCard";
import InvitationForm from "@/components/invitations/InvitationForm";

export default function ParentDashboard() {
  const searchParams = useSearchParams();
  const showForm = searchParams?.get("action") === "new-invitation";

  const [historyRefreshKey, setHistoryRefreshKey] = useState(0);

  return (
    <main className="container">
      <h1>🏠 Mi Dashboard Familiar</h1>

      <DashboardOverview
        onHistoryRefresh={() => setHistoryRefreshKey((prev) => prev + 1)}
      />

      {showForm && (
        <div style={{ marginBottom: "2rem" }}>
          <InvitationForm />
        </div>
      )}

      <DashboardQuickActions />

      <section style={{ marginTop: "2rem" }}>
        <h2>📚 Historial reciente</h2>
        <HistoryList recentOnly={true} refreshKey={historyRefreshKey} />
      </section>
    </main>
  );
}
