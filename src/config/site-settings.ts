import { externalLinks } from "@/config/links";

export type SiteSettings = {
  ticketsUrl: string;
  subtitle: { ua: string; en: string };
};

export const seedSiteSettings: SiteSettings = {
  ticketsUrl: externalLinks.tickets,
  subtitle: {
    ua: "Ювілейне «Літнє Божевілля» завершилося, але залишило після себе багато запитань.",
    en: "The anniversary 'Summertime Madness' has ended, but it left plenty of questions behind.",
  },
};
