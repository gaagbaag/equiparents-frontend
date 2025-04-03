// src/utils/withParentalAccount.ts
import type { Child } from "@/types/child";
import type { ExtendedAuthUser } from "@/types/auth";

export function withParentalAccount<T extends Partial<Child>>(
  child: T,
  user: ExtendedAuthUser | null
): Child {
  if (!user?.parentalAccountId) {
    throw new Error("No se pudo obtener el parentalAccountId del usuario");
  }

  return {
    ...child,
    parentalAccountId: user.parentalAccountId,
    id: child.id ?? "",
    firstName: child.firstName ?? "",
    birthDate: child.birthDate ?? "",
  };
}
