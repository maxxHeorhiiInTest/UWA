import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import {
  ADMIN_COOKIE,
  SESSION_MS,
  createSessionToken,
  credentialsMatch,
  verifySessionToken,
} from "@/lib/session";

export {
  ADMIN_COOKIE,
  createSessionToken,
  credentialsMatch,
  verifySessionToken,
} from "@/lib/session";

export async function getSession() {
  const store = await cookies();
  const token = store.get(ADMIN_COOKIE)?.value;
  if (!token) return null;
  return verifySessionToken(token);
}

export async function requireAdmin() {
  const session = await getSession();
  if (!session) redirect("/admin/login");
  return session;
}

export async function setSessionCookie(username: string) {
  const store = await cookies();
  store.set(ADMIN_COOKIE, createSessionToken(username), {
    httpOnly: true,
    sameSite: "lax",
    path: "/",
    secure: process.env.NODE_ENV === "production",
    maxAge: SESSION_MS / 1000,
  });
}

export async function clearSessionCookie() {
  const store = await cookies();
  store.delete(ADMIN_COOKIE);
}
