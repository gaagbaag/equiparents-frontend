"use client";

import { useEffect, useState } from "react";
import { useAppDispatch, useAppSelector } from "@/redux/hooks";
import { fetchCurrentUser } from "@/redux/thunks/fetchCurrentUser";
import Sidebar from "@/components/layout/Sidebar";
import Header from "@/components/layout/Header";

export default function ClientLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const dispatch = useAppDispatch();
  const token = useAppSelector((state) => state.auth.token);
  const isAuthenticated = useAppSelector((state) => state.auth.isAuthenticated);
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const load = async () => {
      try {
        await dispatch(fetchCurrentUser()).unwrap();
      } catch (err) {
        console.warn("🔒 No se pudo autenticar desde cookie.");
      } finally {
        setLoading(false);
      }
    };

    if (!isAuthenticated) {
      load();
    } else {
      setLoading(false);
    }
  }, [dispatch, isAuthenticated]);

  if (loading) return <div className="p-4">⏳ Esperando autenticación...</div>;

  return (
    <div className="w-full min-h-screen flex bg-gray-50">
      <Sidebar open={sidebarOpen} setOpen={setSidebarOpen} />
      <div className="flex flex-col flex-1">
        <Header />
        <main className="flex-grow w-full px-4">{children}</main>
      </div>
    </div>
  );
}
