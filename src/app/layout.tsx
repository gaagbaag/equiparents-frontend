// src/app/layout.tsx
import "@/styles/globals.css";
import { ReactNode } from "react";
import Providers from "./providers";

export const metadata = {
  title: "Equi·Parents",
  description: "Plataforma de corresponsabilidad parental",
};

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="es">
      <body className="w-full min-h-screen bg-gray-50">
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}
