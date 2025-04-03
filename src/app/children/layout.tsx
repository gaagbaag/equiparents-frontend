// app/children/layout.tsx
import AuthenticatedLayout from "@/components/layout/AuthenticatedLayout";

export default function ChildrenLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <AuthenticatedLayout>{children}</AuthenticatedLayout>;
}
