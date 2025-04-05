// utils/getRedirectRoute.ts
export function getRedirectRoute(roles: string[] = []): string {
  if (roles.includes("admin")) return "/admin/dashboard";
  if (roles.includes("parent")) return "/dashboard";
  return "/onboarding";
}
