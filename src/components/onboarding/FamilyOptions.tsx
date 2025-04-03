// src/components/onboarding/FamilyOptions.tsx
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
      <button className="button" onClick={onCreate} disabled={loading}>
        {loading ? "Creando cuenta..." : "Crear una nueva cuenta parental"}
      </button>

      <button
        className="button button-secondary"
        onClick={() => router.push("/onboarding/invite")}
      >
        Unirme con código de invitación
      </button>

      {error && <p className="error-message mt-4">{error}</p>}
    </div>
  );
}
