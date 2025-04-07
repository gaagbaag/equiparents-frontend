"use client";

import { useEffect, useState } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import { useAppSelector } from "@/redux/hooks";

import DashboardLayout from "@/components/layout/DashboardLayout";
import InvitationForm from "@/components/invitations/InvitationForm";
import DashboardQuickActions from "@/components/dashboard/DashboardQuickActions";
import HistoryList from "@/components/HistoryList";
import DashboardOverview from "@/components/dashboard/DashboardOverview";
import RequireAuth from "@/components/auth/RequireAuth";

export default function ParentDashboardPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const showForm = searchParams?.get("action") === "new-invitation";

  const [inviteCode, setInviteCode] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);
  const [loadingAccount, setLoadingAccount] = useState(true);

  const user = useAppSelector((state) => state.auth.user);
  const parentalAccountId = user?.parentalAccountId;

  useEffect(() => {
    if (!user) {
      console.warn("⚠️ Usuario no autenticado aún.");
      return;
    }

    if (!parentalAccountId) {
      console.warn("⚠️ No se encontró cuenta parental para este usuario.");
      // router.push("/onboarding/family"); // Descomentar si deseas redirigir automáticamente
    }

    setLoadingAccount(false);
  }, [user, parentalAccountId]);

  const handleInviteSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    setSuccess(false);

    try {
      const response = await fetch("/api/invitations/accept", {
        method: "POST",
        body: JSON.stringify({ inviteCode }),
        headers: {
          "Content-Type": "application/json",
        },
      });

      if (!response.ok) {
        throw new Error("Hubo un problema al unirse a la cuenta.");
      }

      setSuccess(true);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Error desconocido");
    } finally {
      setLoading(false);
    }
  };

  if (loadingAccount) {
    return <div className="p-4">⏳ Cargando cuenta parental...</div>;
  }

  if (!parentalAccountId) {
    return (
      <div className="p-4 text-red-600">
        ⚠️ No tienes una cuenta parental asociada. <br />
        Por favor completa el <strong>onboarding</strong> o contacta con el
        administrador.
      </div>
    );
  }

  return (
    <RequireAuth>
      <DashboardLayout>
        <main className="container">
          <h1 className="text-xl font-semibold mb-4">
            🏠 Mi Dashboard Familiar
          </h1>

          <DashboardOverview />

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
            <HistoryList recentOnly={true} />
          </section>
        </main>
      </DashboardLayout>
    </RequireAuth>
  );
}
