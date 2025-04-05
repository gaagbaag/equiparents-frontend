// src/components/ui/FullScreenLoader.tsx
"use client";

export default function FullScreenLoader() {
  return (
    <div className="flex items-center justify-center min-h-screen w-full bg-gray-100">
      <div className="text-center space-y-4">
        <div className="animate-spin rounded-full h-12 w-12 border-t-4 border-blue-500 border-solid mx-auto" />
        <p className="text-gray-600 text-lg">Cargando...</p>
      </div>
    </div>
  );
}
