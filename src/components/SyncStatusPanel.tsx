"use client";

import { useEffect, useState } from "react";
import useSyncUserWithBackend from "@/hooks/useSyncUserWithBackend";

type Props = {
  isSyncing: boolean;
  error?: string | null;
};

export default function SyncStatusPanel({ isSyncing, error }: Props) {
  const [statusMessage, setStatusMessage] = useState("");

  useEffect(() => {
    if (isSyncing) {
      setStatusMessage("🔄 Sincronizando usuario con backend...");
    } else if (error) {
      setStatusMessage("⚠️ Hubo un problema al sincronizar tu cuenta.");
    } else {
      setStatusMessage("✅ Usuario sincronizado correctamente.");
    }
  }, [isSyncing, error]);

  return (
    <div className="sync-status-panel">
      <p className="text-sm text-gray-600">{statusMessage}</p>
    </div>
  );
}
