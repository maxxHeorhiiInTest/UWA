"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import {
  rosterCategories,
  type LocalizedText,
  type RosterCategory,
  type WrestlerVideo,
} from "@/config/roster";
import { normalizeVideoUrl } from "@/lib/video";
import {
  clearSessionCookie,
  credentialsMatch,
  requireAdmin,
  setSessionCookie,
} from "@/lib/auth";
import {
  deleteWrestler,
  getWrestlers,
  newWrestler,
  savePhoto,
  saveWrestler,
} from "@/lib/roster-store";
import { uniqueId } from "@/lib/slug";

export type AuthState = { error?: string } | undefined;
export type SaveState =
  | { ok: true; savedAt: number; id?: string; created?: boolean }
  | { error: string }
  | undefined;

export async function loginAction(_state: AuthState, formData: FormData) {
  const username = String(formData.get("username") ?? "");
  const password = String(formData.get("password") ?? "");
  if (!credentialsMatch(username, password)) {
    return { error: "Невірний логін або пароль." };
  }
  await setSessionCookie(username);
  redirect("/admin");
}

export async function logoutAction() {
  await clearSessionCookie();
  redirect("/admin/login");
}

function readList(formData: FormData, prefix: string): LocalizedText[] {
  const count = Number(formData.get(`${prefix}Count`) ?? 0);
  const items: LocalizedText[] = [];
  for (let i = 0; i < count; i += 1) {
    const ua = String(formData.get(`${prefix}Ua-${i}`) ?? "").trim();
    const en = String(formData.get(`${prefix}En-${i}`) ?? "").trim();
    if (!ua && !en) continue;
    items.push({ ua, en });
  }
  return items;
}

function readVideos(formData: FormData): WrestlerVideo[] {
  const count = Number(formData.get("videosCount") ?? 0);
  const items: WrestlerVideo[] = [];
  for (let i = 0; i < count; i += 1) {
    const ua = String(formData.get(`videosUa-${i}`) ?? "").trim();
    const en = String(formData.get(`videosEn-${i}`) ?? "").trim();
    const url = String(formData.get(`videosUrl-${i}`) ?? "").trim();
    if (!ua && !en && !url) continue;
    items.push({ ua, en, url: normalizeVideoUrl(url) });
  }
  return items;
}

function asCategory(value: string): RosterCategory {
  if ((rosterCategories as readonly string[]).includes(value)) {
    return value as RosterCategory;
  }
  return "men";
}

function revalidateRoster() {
  revalidatePath("/", "layout");
  revalidatePath("/[locale]/roster", "page");
  revalidatePath("/ua/roster", "page");
  revalidatePath("/en/roster", "page");
  revalidatePath("/admin", "layout");
}

export async function createWrestlerAction(
  _prev: SaveState,
  formData: FormData
): Promise<SaveState> {
  await requireAdmin();
  const nameUa = String(formData.get("nameUa") ?? "").trim();
  const nameEn = String(formData.get("nameEn") ?? "").trim();
  if (!nameUa && !nameEn) {
    return { error: "Потрібне ім’я." };
  }
  try {
    const category = asCategory(String(formData.get("category") ?? "men"));
    const wrestlers = await getWrestlers();
    const id = uniqueId(
      nameEn || nameUa,
      new Set(wrestlers.map((item) => item.id))
    );
    const created = newWrestler({
      id,
      category,
      name: { ua: nameUa || nameEn, en: nameEn || nameUa },
    });
    await saveWrestler(created);
    revalidateRoster();
    return { ok: true, savedAt: Date.now(), id, created: true };
  } catch (error) {
    console.error("Failed to create wrestler", error);
    return { error: "Не вдалося створити картку." };
  }
}

export async function saveWrestlerAction(
  _prev: SaveState,
  formData: FormData
): Promise<SaveState> {
  await requireAdmin();
  const previousId = String(formData.get("id") ?? "");
  if (!previousId) return { error: "Немає id картки." };

  try {
    const nameUa = String(formData.get("nameUa") ?? "").trim();
    const nameEn = String(formData.get("nameEn") ?? "").trim();
    const category = asCategory(String(formData.get("category") ?? "men"));
    const keepPhotos = formData
      .getAll("keepPhoto")
      .map((item) => String(item))
      .filter(Boolean);

    const photos = [...keepPhotos];
    const uploads = formData.getAll("photos").filter((item): item is File => {
      return item instanceof File && item.size > 0;
    });
    for (const file of uploads) {
      photos.push(await savePhoto(previousId, file));
    }

    const next = {
      id: previousId,
      category,
      name: { ua: nameUa || nameEn, en: nameEn || nameUa },
      bio: readList(formData, "bio"),
      photos,
      titles: readList(formData, "titles"),
      matches: readList(formData, "matches"),
      videos: readVideos(formData),
      rivalries: readList(formData, "rivalries"),
    };

    await saveWrestler(next, previousId);
    revalidateRoster();
    return { ok: true, savedAt: Date.now() };
  } catch (error) {
    console.error("Failed to save wrestler", error);
    return { error: "Не вдалося зберегти. Спробуйте ще раз." };
  }
}

export async function deleteWrestlerAction(formData: FormData) {
  await requireAdmin();
  const id = String(formData.get("id") ?? "");
  if (!id) return;
  await deleteWrestler(id);
  revalidateRoster();
  redirect("/admin");
}
