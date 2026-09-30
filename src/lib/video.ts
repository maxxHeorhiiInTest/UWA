export type VideoEmbed =
  | { type: "youtube"; id: string }
  | { type: "vimeo"; id: string }
  | { type: "file"; src: string }
  | { type: "link"; href: string };

function withHttps(value: string) {
  if (/^https?:\/\//i.test(value)) return value;
  return `https://${value}`;
}

export function normalizeVideoUrl(raw: string) {
  const value = raw.trim();
  if (!value) return "";
  if (
    /^(www\.)?(youtube\.com|youtu\.be|vimeo\.com)\//i.test(value) &&
    !/^https?:\/\//i.test(value)
  ) {
    return withHttps(value);
  }
  return value;
}

function youtubeId(url: URL) {
  const host = url.hostname.replace(/^www\./, "");
  if (host === "youtu.be") {
    return url.pathname.split("/").filter(Boolean)[0] ?? null;
  }
  if (host === "youtube.com" || host === "m.youtube.com" || host === "youtube-nocookie.com") {
    if (url.pathname.startsWith("/embed/")) {
      return url.pathname.split("/")[2] ?? null;
    }
    if (url.pathname.startsWith("/shorts/")) {
      return url.pathname.split("/")[2] ?? null;
    }
    if (url.pathname.startsWith("/live/")) {
      return url.pathname.split("/")[2] ?? null;
    }
    return url.searchParams.get("v");
  }
  return null;
}

function vimeoId(url: URL) {
  const host = url.hostname.replace(/^www\./, "");
  if (host !== "vimeo.com" && host !== "player.vimeo.com") return null;
  const parts = url.pathname.split("/").filter(Boolean);
  const id = host === "player.vimeo.com" ? parts[1] : parts[0];
  return id && /^\d+$/.test(id) ? id : null;
}

function isDirectVideo(url: URL) {
  const path = url.pathname.toLowerCase();
  if (path.includes("/roster/videos/")) return true;
  return /\.(mp4|webm|mov|m4v|ogg)(\?|$)/i.test(path);
}

export function getVideoEmbed(raw: string): VideoEmbed | null {
  const value = normalizeVideoUrl(raw);
  if (!value) return null;
  try {
    const url = new URL(value);
    if (!/^https?:$/i.test(url.protocol)) return null;
    const yt = youtubeId(url);
    if (yt) return { type: "youtube", id: yt };
    const vimeo = vimeoId(url);
    if (vimeo) return { type: "vimeo", id: vimeo };
    if (isDirectVideo(url)) return { type: "file", src: url.href };
    return { type: "link", href: url.href };
  } catch {
    return null;
  }
}
