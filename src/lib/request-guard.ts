import { headers } from "next/headers";

function hostFrom(value: string | null) {
  if (!value) return "";
  try {
    if (value.includes("://")) return new URL(value).host.toLowerCase();
    return new URL(`https://${value}`).host.toLowerCase();
  } catch {
    return "";
  }
}

export function requestHost(headerStore: Headers) {
  return hostFrom(
    headerStore.get("x-forwarded-host") ?? headerStore.get("host")
  );
}

export function clientIp(headerStore: Headers) {
  const forwarded = headerStore.get("x-forwarded-for");
  if (forwarded) {
    const first = forwarded.split(",")[0]?.trim();
    if (first) return first;
  }
  return headerStore.get("x-real-ip")?.trim() || "unknown";
}

export function isTrustedMutation(request: Request) {
  const site = request.headers.get("sec-fetch-site");
  if (site === "same-origin") return true;

  const originHost = hostFrom(request.headers.get("origin"));
  const host = requestHost(request.headers);
  return Boolean(originHost && host && originHost === host);
}

export async function requestClientIp() {
  return clientIp(await headers());
}
