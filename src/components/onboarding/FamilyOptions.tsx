"use client";

import type { FamilyOptionsProps } from "@/types/onboarding";

export default function FamilyOptions({
  onCreate,
  onJoin,
  loading,
  error,
}: FamilyOptionsProps) {
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
        onClick={onJoin}
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
