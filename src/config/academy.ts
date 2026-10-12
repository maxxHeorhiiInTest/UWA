import type { LocalizedText } from "@/config/roster";
import { externalLinks } from "@/config/links";

export type AcademyTrainer = {
  id: string;
  wrestlerId: string;
  name: LocalizedText;
  shortName: LocalizedText[];
  photo: string;
  intro: LocalizedText;
  bio: LocalizedText;
  videoUrl?: string;
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

export const academyTrainers: AcademyTrainer[] = [
  {
    id: "diehard-dustin-lee",
    wrestlerId: "diehard-dustin-lee",
    name: {
      ua: "Дайхард Дастін Лі",
      en: "Diehard Dustin Lee",
    },
    shortName: [
      { ua: "Дайхард Дастін Лі", en: "Diehard Dustin Lee" },
    ],
    photo: "/roster/diehard-dustin-lee-hq.png",
    intro: {
      ua: "«Дайхард» Дастін Лі (Diehard Dustin Lee) — це американський професійний реслер, який здобув визнання завдяки своїм виступам у жорстоких хардкорних та дезматч-промоушенах.",
      en: "'Diehard' Dustin Lee is an American professional wrestler who made his name in brutal hardcore and deathmatch promotions.",
    },
    bio: {
      ua: "Він більш відомий участю в екстремальних подіях таких незалежних організацій, як IWA Mid-South та Combat Zone Wrestling (CZW), де часто використовується зброя та нестандартний інвентар.",
      en: "He is best known for extreme events in independent promotions such as IWA Mid-South and Combat Zone Wrestling (CZW), where weapons and unconventional objects are often used.",
    },
  },
  {
    id: "dmytro-gambit-shamrai",
    wrestlerId: "dmytro-gambit-shamrai",
    name: {
      ua: "Дмитро Шамрай Гамбіт",
      en: "Dmytro Shamrai Gambit",
    },
    shortName: [
      { ua: "Дмитро Шамрай", en: "Dmytro Shamrai" },
      { ua: "Гамбіт", en: "Gambit" },
    ],
    photo: "/roster/dmytro-gambit-shamrai-hq3.png",
    intro: {
      ua: "Дмитро «Гамбіт» Шамрай — неймовірно технічний та винахідливий реслер Української Реслінг Арени.",
      en: 'Dmytro "Gambit" Shamrai is an exceptionally technical and inventive wrestler of the Ukrainian Wrestling Arena.',
    },
    bio: {
      ua: "На ринзі він відомий картковим образом і винахідливим стилем.",
      en: "In the ring he is known for his card-themed persona and inventive style.",
    },
  },
];
