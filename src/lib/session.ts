import { createHmac, timingSafeEqual } from "crypto";

export const ADMIN_COOKIE = "uwa_admin";
export const SESSION_MS = 7 * 24 * 60 * 60 * 1000;

export type AdminSession = { u: string; exp: number };

function hmac(value: string, key: string) {
  return createHmac("sha256", key).update(value).digest("base64url");
}

function safeEqual(a: string, b: string) {
  const left = Buffer.from(a);
  const right = Buffer.from(b);
  if (left.length !== right.length) return false;
  return timingSafeEqual(left, right);
}

function digest(prefix: string, value: string, key: string) {
  return hmac(`${prefix}:${value}`, key);
}

export function createSessionToken(username: string) {
  const key = process.env.AUTH_SECRET;
  if (!key) {
    throw new Error("AUTH_SECRET is not set");
  }
  const payload = Buffer.from(
    JSON.stringify({ u: username, exp: Date.now() + SESSION_MS })
  ).toString("base64url");
  return `${payload}.${hmac(payload, key)}`;
}

export function verifySessionToken(token: string): AdminSession | null {
  const key = process.env.AUTH_SECRET;
  if (!key || !token) return null;

  const separator = token.lastIndexOf(".");
  if (separator <= 0) return null;

  const payload = token.slice(0, separator);
  const signature = token.slice(separator + 1);
  if (!payload || !signature) return null;
  if (!safeEqual(signature, hmac(payload, key))) return null;

  try {
    const session = JSON.parse(
      Buffer.from(payload, "base64url").toString("utf8")
    ) as AdminSession;
    if (
      typeof session?.u !== "string" ||
      !session.u ||
      typeof session.exp !== "number" ||
      session.exp < Date.now()
    ) {
      return null;
    }
    return session;
  } catch {
    return null;
  }
}

export function credentialsMatch(username: string, password: string) {
  const key = process.env.AUTH_SECRET;
  const expectedUser = process.env.ADMIN_USERNAME ?? "";
  const expectedPass = process.env.ADMIN_PASSWORD ?? "";
  if (!key || !expectedUser || !expectedPass) return false;

  const userOk = safeEqual(
    digest("user", username, key),
    digest("user", expectedUser, key)
  );
  const passOk = safeEqual(
    digest("pass", password, key),
    digest("pass", expectedPass, key)
  );
  return userOk && passOk;
}
