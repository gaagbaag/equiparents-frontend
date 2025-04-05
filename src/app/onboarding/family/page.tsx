"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { jwtDecode } from "jwt-decode";
import { CustomJwtPayload } from "@/types/jwt";
import fetchWithToken from "@/utils/fetchWithToken";
import { handleFetchErrors } from "@/utils/handleFetchErrors";
import { logFetchError } from "@/utils/logFetchError";
import FamilyOptions from "@/components/onboarding/FamilyOptions";
import ExpiredInviteMessage from "@/components/onboarding/ExpiredInviteMessage";
import { useOnce } from "@/hooks/useOnce";

export default function FamilyPage() {
  const router = useRouter();
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [expiredMessage, setExpiredMessage] = useState<string | null>(null);

  useEffect(() => {
    let mounted = true;

    const fetchExpired = async () => {
      try {
        const res = await fetchWithToken(
          `${process.env.NEXT_PUBLIC_API_URL}/api/invitations/expired`
        );

        if (res.status === 404) {
          console.info("ℹ️ No hay invitaciones caducadas activas.");
          return;
        }

        const data = await handleFetchErrors(res);
        if (mounted && data?.email && data?.expiredAt) {
          const date = new Date(data.expiredAt).toLocaleDateString("es-CL", {
            day: "2-digit",
            month: "long",
            year: "numeric",
          });
          setExpiredMessage(
            `La invitación enviada a ${data.email} ha caducado el ${date}.`
          );
        }
      } catch (err: any) {
        logFetchError(err, "consultar invitación caducada");
      }
    };

    const checkParentalAccount = async () => {
      try {
        const tokenRes = await fetch("/api/auth/token");
        const { accessToken } = await tokenRes.json();

        const res = await fetch(
          `${process.env.NEXT_PUBLIC_API_URL}/api/parental-accounts/my-account`,
          {
            headers: {
              Authorization: `Bearer ${accessToken}`,
            },
          }
        );

        if (res.ok) {
          const data = await res.json();
          if (data?.id) {
            router.replace("/dashboard");
            return;
          }
        }
      } catch (err) {
        console.error("Error al obtener cuenta parental:", err);
      }
    };

    useOnce(() => {
      checkParentalAccount();
      fetchExpired();
    });

    return () => {
      mounted = false;
    };
  }, [router]);

  const handleCreate = async () => {
    setLoading(true);
    setError(null);

    try {
      const tokenRes = await fetch("/api/auth/token");
      const { accessToken } = await tokenRes.json();
      const decoded = jwtDecode<CustomJwtPayload>(accessToken);
      const roles = decoded["https://equiparents.api/roles"];

      if (Array.isArray(roles) && roles.includes("admin")) {
        router.push("/admin/dashboard");
        return;
      }

      const res = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/api/onboarding/family`,
        {
          method: "POST",
          headers: {
            Authorization: `Bearer ${accessToken}`,
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ option: "new" }),
        }
      );

      if (!res.ok) {
        const data = await res.json();
        throw new Error(data.message || "Error al crear la cuenta parental");
      }

      router.push("/dashboard");
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleJoinWithCode = () => {
    router.push("/onboarding/invite");
  };

  return (
    <main className="container page-center">
      <h2 className="heading-lg">Configura tu cuenta parental</h2>
      <p className="mb-4">¿Cómo deseas comenzar tu cuenta parental?</p>

      {expiredMessage && <ExpiredInviteMessage message={expiredMessage} />}

      <FamilyOptions
        onCreate={handleCreate}
        loading={loading}
        error={error}
        router={router}
      />

      <button
        className="button button-secondary mt-4"
        onClick={handleJoinWithCode}
      >
        Unirme con código de invitación
      </button>
    </main>
  );
}
