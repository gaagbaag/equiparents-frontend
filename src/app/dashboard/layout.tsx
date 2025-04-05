import RequireAuth from "@/components/auth/RequireAuth";
import RequireProfileComplete from "@/components/auth/RequireProfileComplete";

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <RequireAuth>
      <RequireProfileComplete>
        <div className="flex h-screen">{/* Sidebar y contenido */}</div>
      </RequireProfileComplete>
    </RequireAuth>
  );
}
