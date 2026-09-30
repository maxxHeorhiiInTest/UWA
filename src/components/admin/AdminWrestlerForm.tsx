"use client";

import { useState } from "react";
import Image from "next/image";
import {
  rosterCategories,
  type LocalizedText,
  type RosterCategory,
  type Wrestler,
  type WrestlerVideo,
} from "@/config/roster";
import { deleteWrestlerAction, saveWrestlerAction } from "@/app/admin/actions";

const categoryLabel: Record<RosterCategory, string> = {
  men: "Чоловіки",
  women: "Жінки",
  guests: "Гості",
  teams: "Команди",
  managers: "Менеджери",
  referees: "Судді",
  alumni: "Alumni",
};

function emptyLine(): LocalizedText {
  return { ua: "", en: "" };
}

function emptyVideo(): WrestlerVideo {
  return { ua: "", en: "", url: "" };
}

function videoExt(file: File) {
  const allowed = new Map([
    ["video/mp4", "mp4"],
    ["video/webm", "webm"],
    ["video/quicktime", "mov"],
    ["video/x-m4v", "m4v"],
  ]);
  const fromType = allowed.get(file.type);
  if (fromType) return fromType;
  const match = file.name.toLowerCase().match(/\.(mp4|webm|mov|m4v)$/);
  return match?.[1] ?? null;
}

function TextListEditor({
  label,
  prefix,
  items,
  onChange,
}: {
  label: string;
  prefix: string;
  items: LocalizedText[];
  onChange: (items: LocalizedText[]) => void;
}) {
  return (
    <fieldset className="space-y-3">
      <legend className="text-xs font-bold uppercase tracking-wide text-uwa-white/60">
        {label}
      </legend>
      <input type="hidden" name={`${prefix}Count`} value={items.length} />
      {items.map((item, index) => (
        <div
          key={`${prefix}-${index}`}
          className="grid gap-2 rounded-md border border-uwa-panel-border p-3 sm:grid-cols-2"
        >
          <textarea
            name={`${prefix}Ua-${index}`}
            defaultValue={item.ua}
            placeholder="UA"
            rows={3}
            className="w-full rounded-md border border-uwa-panel-border bg-uwa-black px-3 py-2 text-sm text-uwa-white outline-none focus:border-uwa-red"
            onChange={(event) => {
              const next = [...items];
              next[index] = { ...next[index], ua: event.target.value };
              onChange(next);
            }}
          />
          <textarea
            name={`${prefix}En-${index}`}
            defaultValue={item.en}
            placeholder="EN"
            rows={3}
            className="w-full rounded-md border border-uwa-panel-border bg-uwa-black px-3 py-2 text-sm text-uwa-white outline-none focus:border-uwa-red"
            onChange={(event) => {
              const next = [...items];
              next[index] = { ...next[index], en: event.target.value };
              onChange(next);
            }}
          />
          <button
            type="button"
            onClick={() => onChange(items.filter((_, i) => i !== index))}
            className="text-left text-xs uppercase tracking-wide text-uwa-white/40 hover:text-uwa-red sm:col-span-2"
          >
            Прибрати рядок
          </button>
        </div>
      ))}
      <button
        type="button"
        onClick={() => onChange([...items, emptyLine()])}
        className="text-xs font-medium uppercase tracking-wide text-uwa-red hover:text-uwa-white"
      >
        + Додати рядок
      </button>
    </fieldset>
  );
}

function VideoListEditor({
  wrestlerId,
  items,
  onChange,
}: {
  wrestlerId: string;
  items: WrestlerVideo[];
  onChange: (items: WrestlerVideo[]) => void;
}) {
  const [uploading, setUploading] = useState<number | null>(null);
  const [error, setError] = useState<string | null>(null);

  async function uploadFile(index: number, file: File) {
    const ext = videoExt(file);
    if (!ext) {
      setError("Потрібен файл mp4, webm або mov.");
      return;
    }
    setError(null);
    setUploading(index);
    try {
      const { upload } = await import("@vercel/blob/client");
      const blob = await upload(
        `roster/videos/${wrestlerId}-${Date.now()}.${ext}`,
        file,
        {
          access: "public",
          handleUploadUrl: "/api/admin/video",
          multipart: file.size > 4.5 * 1024 * 1024,
        }
      );
      const next = [...items];
      next[index] = { ...next[index], url: blob.url };
      onChange(next);
    } catch (caught) {
      setError(
        caught instanceof Error
          ? caught.message
          : "Не вдалося завантажити відео."
      );
    } finally {
      setUploading(null);
    }
  }

  return (
    <fieldset className="space-y-3">
      <legend className="text-xs font-bold uppercase tracking-wide text-uwa-white/60">
        Відео
      </legend>
      <p className="text-xs text-uwa-white/40">
        YouTube / Vimeo посилання або файл mp4/webm до 80 МБ. Файл іде в Blob.
      </p>
      {error ? <p className="text-xs text-uwa-red">{error}</p> : null}
      <input type="hidden" name="videosCount" value={items.length} />
      {items.map((item, index) => (
        <div
          key={`videos-${index}`}
          className="space-y-2 rounded-md border border-uwa-panel-border p-3"
        >
          <input
            name={`videosUrl-${index}`}
            value={item.url}
            placeholder="https://youtube.com/watch?v=…"
            className="w-full rounded-md border border-uwa-panel-border bg-uwa-black px-3 py-2 text-sm text-uwa-white outline-none focus:border-uwa-red"
            onChange={(event) => {
              const next = [...items];
              next[index] = { ...next[index], url: event.target.value };
              onChange(next);
            }}
          />
          <label className="block text-xs text-uwa-white/50">
            <span className="mb-1.5 block uppercase tracking-wide">
              {uploading === index ? "Завантаження…" : "Або файл"}
            </span>
            <input
              type="file"
              accept="video/mp4,video/webm,video/quicktime"
              disabled={uploading !== null}
              className="block w-full text-sm text-uwa-white/70 file:mr-3 file:border-0 file:bg-uwa-red file:px-3 file:py-2 file:text-xs file:font-bold file:uppercase file:text-uwa-white disabled:opacity-50"
              onChange={(event) => {
                const file = event.target.files?.[0];
                event.target.value = "";
                if (file) void uploadFile(index, file);
              }}
            />
          </label>
          <div className="grid gap-2 sm:grid-cols-2">
            <textarea
              name={`videosUa-${index}`}
              defaultValue={item.ua}
              placeholder="Підпис UA"
              rows={2}
              className="w-full rounded-md border border-uwa-panel-border bg-uwa-black px-3 py-2 text-sm text-uwa-white outline-none focus:border-uwa-red"
              onChange={(event) => {
                const next = [...items];
                next[index] = { ...next[index], ua: event.target.value };
                onChange(next);
              }}
            />
            <textarea
              name={`videosEn-${index}`}
              defaultValue={item.en}
              placeholder="Підпис EN"
              rows={2}
              className="w-full rounded-md border border-uwa-panel-border bg-uwa-black px-3 py-2 text-sm text-uwa-white outline-none focus:border-uwa-red"
              onChange={(event) => {
                const next = [...items];
                next[index] = { ...next[index], en: event.target.value };
                onChange(next);
              }}
            />
          </div>
          <button
            type="button"
            onClick={() => onChange(items.filter((_, i) => i !== index))}
            className="text-left text-xs uppercase tracking-wide text-uwa-white/40 hover:text-uwa-red"
          >
            Прибрати рядок
          </button>
        </div>
      ))}
      <button
        type="button"
        onClick={() => onChange([...items, emptyVideo()])}
        className="text-xs font-medium uppercase tracking-wide text-uwa-red hover:text-uwa-white"
      >
        + Додати рядок
      </button>
    </fieldset>
  );
}

export function AdminWrestlerForm({ wrestler }: { wrestler: Wrestler }) {
  const [bio, setBio] = useState(
    wrestler.bio.length > 0 ? wrestler.bio : [emptyLine()]
  );
  const [titles, setTitles] = useState(wrestler.titles);
  const [matches, setMatches] = useState(wrestler.matches);
  const [videos, setVideos] = useState(wrestler.videos);
  const [rivalries, setRivalries] = useState(wrestler.rivalries);
  const [photos, setPhotos] = useState(wrestler.photos);

  return (
    <form action={saveWrestlerAction} className="space-y-8">
      <input type="hidden" name="id" value={wrestler.id} />
      {photos.map((src) => (
        <input key={src} type="hidden" name="keepPhoto" value={src} />
      ))}

      <div className="grid gap-4 sm:grid-cols-2">
        <label className="block">
          <span className="text-xs font-medium uppercase tracking-wide text-uwa-white/50">
            Ім’я UA
          </span>
          <input
            name="nameUa"
            required
            defaultValue={wrestler.name.ua}
            className="mt-1.5 w-full rounded-md border border-uwa-panel-border bg-uwa-black px-3 py-2.5 text-sm outline-none focus:border-uwa-red"
          />
        </label>
        <label className="block">
          <span className="text-xs font-medium uppercase tracking-wide text-uwa-white/50">
            Ім’я EN
          </span>
          <input
            name="nameEn"
            required
            defaultValue={wrestler.name.en}
            className="mt-1.5 w-full rounded-md border border-uwa-panel-border bg-uwa-black px-3 py-2.5 text-sm outline-none focus:border-uwa-red"
          />
        </label>
      </div>

      <label className="block max-w-xs">
        <span className="text-xs font-medium uppercase tracking-wide text-uwa-white/50">
          Категорія
        </span>
        <select
          name="category"
          defaultValue={wrestler.category}
          className="mt-1.5 w-full rounded-md border border-uwa-panel-border bg-uwa-black px-3 py-2.5 text-sm outline-none focus:border-uwa-red"
        >
          {rosterCategories.map((key) => (
            <option key={key} value={key}>
              {categoryLabel[key]}
            </option>
          ))}
        </select>
      </label>

      <fieldset>
        <legend className="text-xs font-bold uppercase tracking-wide text-uwa-white/60">
          Фото
        </legend>
        {photos.length > 0 && (
          <ul className="mt-3 flex flex-wrap gap-3">
            {photos.map((src) => (
              <li key={src} className="relative">
                <span className="relative block h-28 w-28 overflow-hidden bg-[#111]">
                  <Image
                    src={src}
                    alt=""
                    fill
                    unoptimized
                    className="object-cover object-top"
                    sizes="112px"
                  />
                </span>
                <button
                  type="button"
                  onClick={() => setPhotos(photos.filter((item) => item !== src))}
                  className="mt-1 text-[11px] uppercase tracking-wide text-uwa-white/40 hover:text-uwa-red"
                >
                  Прибрати
                </button>
              </li>
            ))}
          </ul>
        )}
        <input
          name="photos"
          type="file"
          accept="image/png,image/jpeg,image/webp"
          multiple
          className="mt-3 block w-full text-sm text-uwa-white/70 file:mr-3 file:border-0 file:bg-uwa-red file:px-3 file:py-2 file:text-xs file:font-bold file:uppercase file:text-uwa-white"
        />
      </fieldset>

      <TextListEditor label="Біо" prefix="bio" items={bio} onChange={setBio} />
      {wrestler.category !== "managers" &&
        wrestler.category !== "referees" && (
          <>
            <TextListEditor
              label="Титули"
              prefix="titles"
              items={titles}
              onChange={setTitles}
            />
            <TextListEditor
              label="Історія матчів"
              prefix="matches"
              items={matches}
              onChange={setMatches}
            />
            <VideoListEditor
              wrestlerId={wrestler.id}
              items={videos}
              onChange={setVideos}
            />
            <TextListEditor
              label="Пов’язані суперництва"
              prefix="rivalries"
              items={rivalries}
              onChange={setRivalries}
            />
          </>
        )}

      <div className="flex flex-wrap items-center gap-3">
        <button
          type="submit"
          className="bg-uwa-red px-6 py-3 text-sm font-bold uppercase tracking-wide text-uwa-white hover:bg-uwa-red-dark"
        >
          Зберегти
        </button>
        <a
          href="/admin"
          className="px-4 py-3 text-sm uppercase tracking-wide text-uwa-white/50 hover:text-uwa-white"
        >
          Назад
        </a>
      </div>
    </form>
  );
}

export function DeleteWrestlerButton({
  id,
  name,
}: {
  id: string;
  name: string;
}) {
  return (
    <form
      action={deleteWrestlerAction}
      onSubmit={(event) => {
        if (!confirm(`Видалити картку «${name}»?`)) {
          event.preventDefault();
        }
      }}
    >
      <input type="hidden" name="id" value={id} />
      <button
        type="submit"
        className="text-sm uppercase tracking-wide text-uwa-white/40 hover:text-uwa-red"
      >
        Видалити картку
      </button>
    </form>
  );
}
