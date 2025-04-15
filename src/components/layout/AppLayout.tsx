"use client";

import { useState } from "react";
import Sidebar from "./Sidebar";
import Header from "./Header";
import ProtectedLayout from "./ProtectedLayout";

export default function AppLayout({ children }: { children: React.ReactNode }) {
  const [sidebarOpen, setSidebarOpen] = useState(false);

  return (
    <ProtectedLayout allowedRoles={["admin", "parent"]}>
      <div className="flex h-screen bg-gray-50">
        <Sidebar open={sidebarOpen} setOpen={setSidebarOpen} />
        <div className="flex flex-col flex-1">
          <Header />
          <main className="p-4 flex-1 overflow-y-auto">{children}</main>
        </div>
      </div>
    </ProtectedLayout>
  );
}
