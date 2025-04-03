// components/UserProfileBadge.tsx
"use client";

import { useSelector } from "react-redux";

export default function UserProfileBadge() {
  const user = useSelector((state: any) => state.auth.user);

  if (!user) return null;

  return (
    <div className="flex items-center gap-2">
      {user.picture && (
        <img
          src={user.picture}
          alt="Foto de perfil"
          className="w-8 h-8 rounded-full border border-gray-300"
        />
      )}
      <span className="text-sm text-gray-700 font-medium">{user.name}</span>
    </div>
  );
}
