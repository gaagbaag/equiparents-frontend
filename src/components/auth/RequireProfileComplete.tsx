"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAppSelector } from "@/redux/hooks";

export default function RequireProfileComplete({
  children,
}: {
  children: React.ReactNode;
}) {
  const router = useRouter();
  const { user } = useAppSelector((state) => state.auth);

  useEffect(() => {
    if (!user) return;

    const isProfileComplete =
      !!user.firstName &&
      !!user.lastName &&
      !!user.phone &&
      !!user.countryCode &&
      !!user.countryDialCode;

    if (!isProfileComplete) {
      router.replace("/onboarding/profile");
    }
  }, [user, router]);

  return <>{children}</>;
}
