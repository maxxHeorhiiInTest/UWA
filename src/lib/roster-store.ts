import { promises as fs } from "fs";
import path from "path";
import { BlobNotFoundError, get, put, type BlobAccessType } from "@vercel/blob";
import {
  rosterCategories,
  seedWrestlers,
  type LocalizedText,
  type RosterCategory,
  type Wrestler,
  type WrestlerVideo,
} from "@/config/roster";
import { normalizeVideoUrl } from "@/lib/video";

const STORE_PATH = path.join(process.cwd(), "data", "roster.json");
const PHOTO_DIR = path.join(process.cwd(), "public", "roster");
const ROSTER_BLOB_PATH = "data/roster.json";
const WRITE_CACHE_MS = 15_000;

let lastWrite: { wrestlers: Wrestler[]; at: number } | null = null;

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

function isCategory(value: string): value is RosterCategory {
  return (rosterCategories as readonly string[]).includes(value);
}

function asText(value: unknown): LocalizedText | null {
  if (!value || typeof value !== "object") return null;
  const record = value as { ua?: unknown; en?: unknown };
  if (typeof record.ua !== "string" || typeof record.en !== "string") {
    return null;
  }
  return { ua: record.ua, en: record.en };
}

function asTextList(value: unknown): LocalizedText[] {
  if (!Array.isArray(value)) return [];
  return value.map(asText).filter((item): item is LocalizedText => item !== null);
}

function asVideo(value: unknown): WrestlerVideo | null {
  const text = asText(value);
  if (!text) return null;
  const record = value as { url?: unknown };
  const storedUrl = typeof record.url === "string" ? record.url : "";
  const url =
    normalizeVideoUrl(storedUrl) ||
    normalizeVideoUrl(text.en.startsWith("http") ? text.en : "") ||
    normalizeVideoUrl(text.ua.startsWith("http") ? text.ua : "");
  return { ...text, url };
}

function asVideoList(value: unknown): WrestlerVideo[] {
  if (!Array.isArray(value)) return [];
  return value.map(asVideo).filter((item): item is WrestlerVideo => item !== null);
}

function asWrestler(value: unknown): Wrestler | null {
  if (!value || typeof value !== "object") return null;
  const record = value as Record<string, unknown>;
  if (typeof record.id !== "string" || !record.id) return null;
  if (typeof record.category !== "string" || !isCategory(record.category)) {
    return null;
  }
  const name = asText(record.name);
  if (!name) return null;
  return {
    id: record.id,
    category: record.category,
    name,
    bio: asTextList(record.bio),
    photos: Array.isArray(record.photos)
      ? record.photos.filter((item): item is string => typeof item === "string")
      : [],
    titles: asTextList(record.titles),
    matches: asTextList(record.matches),
    videos: asVideoList(record.videos),
    rivalries: asTextList(record.rivalries),
  };
}

function parseWrestlers(raw: string): Wrestler[] | null {
  try {
    const parsed = JSON.parse(raw) as unknown;
    if (!Array.isArray(parsed)) return null;
    const wrestlers = parsed
      .map(asWrestler)
      .filter((item): item is Wrestler => item !== null);
    return wrestlers;
  } catch {
    return null;
  }
}

async function readStoreFile(): Promise<Wrestler[] | null> {
  try {
    const raw = await fs.readFile(STORE_PATH, "utf8");
    return parseWrestlers(raw);
  } catch {
    return null;
  }
}

async function readBlobBody(access: BlobAccessType): Promise<string | null> {
  try {
    const result = await get(ROSTER_BLOB_PATH, {
      access,
      useCache: false,
      ...blobAuth(),
    });
    if (!result?.stream || result.statusCode !== 200) return null;
    return await new Response(result.stream).text();
  } catch (error) {
    if (error instanceof BlobNotFoundError) return null;
    if (access === "private") return null;
    throw error;
  }
}

async function readBlobStore(): Promise<Wrestler[] | null> {
  const raw =
    (await readBlobBody("private")) ?? (await readBlobBody("public"));
  if (!raw) return null;
  return parseWrestlers(raw);
}

export async function getWrestlers(): Promise<Wrestler[]> {
  if (lastWrite && Date.now() - lastWrite.at < WRITE_CACHE_MS) {
    return structuredClone(lastWrite.wrestlers);
  }
  if (blobEnabled()) {
    const stored = await readBlobStore();
    if (stored) return stored;
    if (process.env.VERCEL) {
      throw new Error("Failed to read roster from Vercel Blob.");
    }
  }
  const stored = await readStoreFile();
  return structuredClone(stored ?? seedWrestlers);
}

export async function getWrestler(id: string) {
  const wrestlers = await getWrestlers();
  return wrestlers.find((wrestler) => wrestler.id === id) ?? null;
}

async function writeWrestlers(wrestlers: Wrestler[]) {
  lastWrite = { wrestlers: structuredClone(wrestlers), at: Date.now() };
  const payload = `${JSON.stringify(wrestlers, null, 2)}\n`;
  if (blobEnabled()) {
    await put(ROSTER_BLOB_PATH, payload, {
      access: "private",
      addRandomSuffix: false,
      allowOverwrite: true,
      contentType: "application/json; charset=utf-8",
      ...blobAuth(),
    });
    return;
  }
  if (process.env.VERCEL) {
    throw new Error(
      "Vercel Blob is not configured. Connect a public Blob store to this project."
    );
  }
  await fs.mkdir(path.dirname(STORE_PATH), { recursive: true });
  await fs.writeFile(STORE_PATH, payload, "utf8");
}

export async function saveWrestler(next: Wrestler, previousId?: string) {
  const wrestlers = await getWrestlers();
  const replaceId = previousId ?? next.id;
  const index = wrestlers.findIndex((wrestler) => wrestler.id === replaceId);
  if (index === -1) {
    wrestlers.push(next);
  } else {
    wrestlers[index] = next;
  }
  await writeWrestlers(wrestlers);
  return next;
}

export async function deleteWrestler(id: string) {
  const wrestlers = await getWrestlers();
  const next = wrestlers.filter((wrestler) => wrestler.id !== id);
  if (next.length === wrestlers.length) return false;
  await writeWrestlers(next);
  return true;
}

export async function savePhoto(id: string, file: File) {
  const allowed = new Map([
    ["image/png", "png"],
    ["image/jpeg", "jpg"],
    ["image/webp", "webp"],
  ]);
  const ext = allowed.get(file.type);
  if (!ext) {
    throw new Error("Unsupported image type");
  }
  const filename = `${id}-${Date.now()}.${ext}`;
  if (blobEnabled()) {
    const blob = await put(`roster/${filename}`, file, {
      access: "public",
      addRandomSuffix: false,
      contentType: file.type,
      ...blobAuth(),
    });
    return blob.url;
  }
  if (process.env.VERCEL) {
    throw new Error(
      "Vercel Blob is not configured. Connect a public Blob store to this project."
    );
  }
  await fs.mkdir(PHOTO_DIR, { recursive: true });
  const dest = path.join(PHOTO_DIR, filename);
  const buffer = Buffer.from(await file.arrayBuffer());
  await fs.writeFile(dest, buffer);
  return `/roster/${filename}`;
}

export function newWrestler(partial: {
  id: string;
  category: RosterCategory;
  name: LocalizedText;
}): Wrestler {
  return {
    id: partial.id,
    category: partial.category,
    name: partial.name,
    bio: [{ ua: "", en: "" }],
    photos: [],
    titles: [],
    matches: [],
    videos: [],
    rivalries: [],
  };
}
