// lib/session.ts
import { getSession } from "@auth0/nextjs-auth0";
import { redirect } from "next/navigation";

export async function requireUser() {
  const session = await getSession();
  if (!session?.user) {
    redirect("/api/auth/login");
  }
  return session.user;
}
