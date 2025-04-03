// src/components/onboarding/ExpiredInviteMessage.tsx
"use client";

export default function ExpiredInviteMessage({ message }: { message: string }) {
  return (
    <div className="info-box text-sm text-gray-700 bg-yellow-100 border border-yellow-300 rounded p-3 mb-4">
      {message}
    </div>
  );
}
