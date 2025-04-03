"use client";

import { type PropsWithChildren } from "react";
import useSyncUserWithBackend from "@/hooks/useSyncUserWithBackend";

export default function OnboardingLayout({ children }: PropsWithChildren) {
  const { isSyncing } = useSyncUserWithBackend();

  if (isSyncing) {
    return (
      <div className="syncing-container">
        <p className="loader" aria-live="polite">
          Cargando tu información segura...
        </p>
      </div>
    );
  }

  return <>{children}</>;
}
