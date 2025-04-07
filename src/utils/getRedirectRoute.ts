type Role = "admin" | "parent";

export function getRedirectRoute(roles: string[] = []): string {
  const validRoles = roles.filter(
    (r): r is Role => r === "admin" || r === "parent"
  );

  if (validRoles.includes("admin")) return "/admin/dashboard";
  if (validRoles.includes("parent")) return "/dashboard";

  return "/onboarding";
}
