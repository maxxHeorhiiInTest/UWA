import { promises as fs } from "fs";
import path from "path";
import { connection } from "next/server";
import { BlobNotFoundError, get, list, put } from "@vercel/blob";
import { seedSiteSettings, type SiteSettings } from "@/config/site-settings";

const STORE_PATH = path.join(process.cwd(), "data", "site-settings.json");
const SETTINGS_BLOB_PATH = "data/site-settings.json";
const SETTINGS_VERSION_PREFIX = "data/site-settings-versions/";
const WRITE_CACHE_MS = 60_000;

let lastWrite: { settings: SiteSettings; at: number } | null = null;

function blobEnabled() {
  return Boolean(
    process.env.BLOB_READ_WRITE_TOKEN ||
      (process.env.BLOB_STORE_ID && process.env.VERCEL_OIDC_TOKEN)
  );
}

function blobAuth() {
  const token = process.env.BLOB_READ_WRITE_TOKEN;
  return token ? { token } : {};
}

function asSettings(value: unknown): SiteSettings | null {
  if (!value || typeof value !== "object") return null;
  const record = value as {
    ticketsUrl?: unknown;
    subtitle?: { ua?: unknown; en?: unknown };
  };
  if (typeof record.ticketsUrl !== "string" || !record.ticketsUrl.trim()) {
    return null;
  }
  if (
    !record.subtitle ||
    typeof record.subtitle.ua !== "string" ||
    typeof record.subtitle.en !== "string"
  ) {
    return null;
  }
  return {
    ticketsUrl: record.ticketsUrl.trim(),
    subtitle: {
      ua: record.subtitle.ua,
      en: record.subtitle.en,
    },
  };
}

function parseSettings(raw: string): SiteSettings | null {
  try {
    return asSettings(JSON.parse(raw) as unknown);
  } catch {
    return null;
  }
}

async function readStoreFile(): Promise<SiteSettings | null> {
  try {
    const raw = await fs.readFile(STORE_PATH, "utf8");
    return parseSettings(raw);
  } catch {
    return null;
  }
}

async function readBlobPath(pathname: string): Promise<string | null> {
  try {
    const result = await get(pathname, {
      access: "public",
      useCache: false,
      ...blobAuth(),
    });
    if (!result?.stream || result.statusCode !== 200) return null;
    return await new Response(result.stream).text();
  } catch (error) {
    if (error instanceof BlobNotFoundError) return null;
    return null;
  }
}

async function readLatestVersion(): Promise<SiteSettings | null> {
  try {
    const listed = await list({
      prefix: SETTINGS_VERSION_PREFIX,
      limit: 1000,
      ...blobAuth(),
    });
    const latest = [...listed.blobs].sort((a, b) =>
      b.pathname.localeCompare(a.pathname)
    )[0];
    if (!latest) return null;
    const raw = await readBlobPath(latest.pathname);
    return raw ? parseSettings(raw) : null;
  } catch {
    return null;
  }
}

async function readBlobStore(): Promise<SiteSettings | null> {
  const versioned = await readLatestVersion();
  if (versioned) return versioned;
  const raw = await readBlobPath(SETTINGS_BLOB_PATH);
  return raw ? parseSettings(raw) : null;
}

export async function getSiteSettings(): Promise<SiteSettings> {
  try {
    await connection();
  } catch {
    // Outside a request, skip.
  }
  if (lastWrite && Date.now() - lastWrite.at < WRITE_CACHE_MS) {
    return structuredClone(lastWrite.settings);
  }
  if (blobEnabled()) {
    const stored = await readBlobStore();
    if (stored) {
      lastWrite = { settings: structuredClone(stored), at: Date.now() };
      return stored;
    }
  }
  if (lastWrite) return structuredClone(lastWrite.settings);
  const stored = await readStoreFile();
  return structuredClone(stored ?? seedSiteSettings);
}

export async function saveSiteSettings(next: SiteSettings): Promise<SiteSettings> {
  lastWrite = { settings: structuredClone(next), at: Date.now() };
  const payload = `${JSON.stringify(next, null, 2)}\n`;
  if (blobEnabled()) {
    const versionPath = `${SETTINGS_VERSION_PREFIX}${Date.now()}.json`;
    await put(versionPath, payload, {
      access: "public",
      addRandomSuffix: false,
      contentType: "application/json; charset=utf-8",
      ...blobAuth(),
    });
    await put(SETTINGS_BLOB_PATH, payload, {
      access: "public",
      addRandomSuffix: false,
      allowOverwrite: true,
      contentType: "application/json; charset=utf-8",
      ...blobAuth(),
    });
    return next;
  }
  if (process.env.VERCEL) {
    throw new Error(
      "Vercel Blob is not configured. Connect a public Blob store to this project."
    );
  }
  await fs.mkdir(path.dirname(STORE_PATH), { recursive: true });
  await fs.writeFile(STORE_PATH, payload, "utf8");
  return next;
}
