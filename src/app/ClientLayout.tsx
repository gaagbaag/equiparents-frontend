"use client";

import { useEffect, useState } from "react";
import { useAppSelector, useAppDispatch } from "@/redux/hooks";
import { fetchAndSetSession } from "@/redux/thunks/fetchAndSetSession";
import Sidebar from "@/components/layout/Sidebar";
import Header from "@/components/layout/Header";

interface Props {
  children: React.ReactNode;
}

export default function ClientLayout({ children }: Props) {
  const dispatch = useAppDispatch();
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [checked, setChecked] = useState(false); // ⏳ Controla carga inicial

  const { token, isAuthenticated } = useAppSelector((state) => state.auth);

  useEffect(() => {
    if (!token || !isAuthenticated) {
      dispatch(fetchAndSetSession()).finally(() => setChecked(true));
    } else {
      setChecked(true);
    }
  }, [dispatch, token, isAuthenticated]);

  if (!checked) {
    return <div className="p-4 text-center">⏳ Verificando sesión...</div>;
  }

  if (!token || !isAuthenticated) {
    return <div className="p-4 text-center text-red-600">❌ No autorizado</div>;
  }

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
