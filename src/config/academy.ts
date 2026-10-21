import type { LocalizedText, Wrestler } from "@/config/roster";
import { externalLinks } from "@/config/links";

export const academyCityIds = ["kyiv", "dnipro", "lviv", "kharkiv"] as const;

export type AcademyCityId = (typeof academyCityIds)[number];

export type AcademyTrainer = {
  id: string;
  cityId: AcademyCityId;
  wrestlerId: string;
  name: LocalizedText;
  photo: string;
  intro: LocalizedText;
  bio: LocalizedText[];
  videoUrl?: string;
};

type AcademyCitySlot = {
  wrestlerId: string;
  photo: string;
};

export type AcademyCity = {
  id: AcademyCityId;
  trainers: AcademyCitySlot[];
};

export const academyPhone = "+38097 888 00 00";
export const academyPhoneHref = "tel:+380978880000";

export const academySchedule = {
  calendarMark: "8",
  days: {
    ua: ["ПН", "СР", "ПТ"],
    en: ["MON", "WED", "FRI"],
  } as Record<"ua" | "en", string[]>,
  time: "17:00 – 20:00",
};

export const academyContactLinks = [
  { label: "Instagram", href: externalLinks.instagram, network: "instagram" as const },
  { label: "Facebook", href: externalLinks.facebook, network: "facebook" as const },
  { label: "YouTube", href: externalLinks.youtube, network: "youtube" as const },
];

export const academyCities: AcademyCity[] = [
  {
    id: "kyiv",
    trainers: [
      {
        wrestlerId: "diehard-dustin-lee",
        photo: "/roster/diehard-dustin-lee-hq.png",
      },
    ],
  },
  {
    id: "dnipro",
    trainers: [{ wrestlerId: "skella", photo: "/roster/skella-hq.png" }],
  },
  {
    id: "lviv",
    trainers: [
      {
        wrestlerId: "viktor-vitrolom",
        photo: "/roster/viktor-vitrolom-hq.png",
      },
    ],
  },
  {
    id: "kharkiv",
    trainers: [{ wrestlerId: "levin", photo: "/roster/levin-hq.png" }],
  },
];

function isStatsLine(text: LocalizedText) {
  return /^\d+\s*(см|cm)\b/i.test(text.ua) || /^\d+\s*(см|cm)\b/i.test(text.en);
}

function filledLines(lines: LocalizedText[] | undefined) {
  return (lines ?? []).filter((line) => line.ua.trim() || line.en.trim());
}

export function academyTrainerFromRoster(
  cityId: AcademyCityId,
  slot: AcademyCitySlot,
  wrestler?: Wrestler
): AcademyTrainer {
  const paragraphs = filledLines(wrestler?.bio);
  const story = paragraphs.filter((line) => !isStatsLine(line));
  const source = story.length > 0 ? story : paragraphs;
  const [intro, ...rest] = source;
  const videoUrl = wrestler?.videos.find((video) => video.url.trim())?.url;

  return {
    id: wrestler?.id ?? slot.wrestlerId,
    cityId,
    wrestlerId: slot.wrestlerId,
    name: wrestler?.name ?? { ua: slot.wrestlerId, en: slot.wrestlerId },
    photo: wrestler?.photos[0] || slot.photo,
    intro: intro ?? { ua: "", en: "" },
    bio: rest,
    videoUrl,
  };
}
