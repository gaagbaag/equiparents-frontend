"use client";

import { useRouter } from "next/navigation";

export default function FamilyOptions({
  onCreate,
  loading,
  error,
  router,
}: {
  onCreate: () => void;
  loading: boolean;
  error: string | null;
  router: ReturnType<typeof useRouter>;
}) {
  return (
    <div className="flex flex-col gap-4">
      <button
        className={`button ${loading ? "bg-gray-500 cursor-not-allowed" : ""}`}
        onClick={onCreate}
        disabled={loading}
        aria-label="Crear una nueva cuenta parental"
      >
        {loading ? "Creando cuenta..." : "Crear una nueva cuenta parental"}
      </button>

      <button
        className="button button-secondary"
        onClick={() => router.push("/onboarding/invite")}
        aria-label="Unirse con código de invitación"
      >
        Unirme con código de invitación
      </button>

      {error && (
        <p className="error-message mt-4" aria-live="polite">
          {error}
        </p>
      )}
    </div>
  );
}
