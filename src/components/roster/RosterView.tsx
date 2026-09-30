"use client";

import { useEffect, useMemo, useState, type ReactNode } from "react";
import Image from "next/image";
import { useLocale } from "next-intl";
import {
  rosterCategories,
  type LocalizedText,
  type RosterCategory,
  type Wrestler,
  type WrestlerVideo,
} from "@/config/roster";
import { getVideoEmbed } from "@/lib/video";
import { SocialRail } from "@/components/layout/SocialRail";
import { ChevronDownIcon } from "@/components/ui/Icons";

type Copy = {
  title: string;
  categories: Record<RosterCategory, string>;
  sections: {
    titles: string;
    matches: string;
    videos: string;
    rivalries: string;
  };
  photoSoon: string;
};

function pick(text: LocalizedText, locale: string) {
  return locale === "en" ? text.en : text.ua;
}

function sortByLocalizedName(list: Wrestler[], locale: string) {
  const collator = new Intl.Collator(locale === "en" ? "en" : "uk", {
    sensitivity: "base",
    numeric: true,
  });
  return [...list].sort((a, b) =>
    collator.compare(pick(a.name, locale), pick(b.name, locale))
  );
}

export function RosterView({
  copy,
  wrestlers,
}: {
  copy: Copy;
  wrestlers: Wrestler[];
}) {
  const locale = useLocale();
  const [category, setCategory] = useState<RosterCategory>("men");
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [openSection, setOpenSection] = useState<string | null>(null);

  const inCategory = useMemo(
    () =>
      sortByLocalizedName(
        wrestlers.filter((wrestler) => wrestler.category === category),
        locale
      ),
    [category, locale]
  );

  const selected = inCategory.find((wrestler) => wrestler.id === selectedId);

  useEffect(() => {
    setSelectedId(null);
    setOpenSection(null);
  }, [category]);

  useEffect(() => {
    if (!selected) return;
    const onKey = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        setSelectedId(null);
        setOpenSection(null);
      }
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [selected]);

  return (
    <section className="relative flex h-full min-h-0 flex-col overflow-hidden bg-uwa-black">
      <div className="mx-auto flex min-h-0 w-full max-w-[1920px] flex-1 flex-col px-4 pt-6 sm:px-10 sm:pt-8 lg:px-16 lg:pt-10 lg:pr-24">
        <h1 className="shrink-0 font-heading text-4xl tracking-wide text-uwa-white sm:text-6xl lg:text-[4.35rem] lg:leading-none">
          {copy.title}
        </h1>

        <div className="mt-5 flex min-h-0 flex-1 flex-col gap-5 sm:mt-8 sm:gap-8 lg:mt-10 lg:flex-row lg:items-stretch lg:gap-14">
          <div className="-mx-4 flex shrink-0 gap-2 overflow-x-auto px-4 scrollbar-none sm:mx-0 sm:gap-3 sm:px-0 lg:w-[14.25rem] lg:flex-col lg:gap-3.5 lg:overflow-visible">
            {rosterCategories.map((key) => {
              const active = key === category;
              return (
                <button
                  key={key}
                  type="button"
                  onClick={() => setCategory(key)}
                  className={`shrink-0 rounded-md px-4 py-2.5 text-xs font-medium uppercase tracking-wide transition-colors sm:px-8 sm:py-[1.125rem] sm:text-sm lg:w-full ${
                    active
                      ? "bg-uwa-red text-uwa-white"
                      : "border border-[#6d6d6d] text-uwa-white hover:border-uwa-white/70"
                  }`}
                >
                  {copy.categories[key]}
                </button>
              );
            })}
          </div>

          <div className="min-h-0 min-w-0 flex-1 overflow-y-auto overscroll-contain pb-10 border-r-0 lg:border-r lg:border-uwa-red/80 lg:pr-10">
            {inCategory.length > 0 ? (
              <ul className="grid grid-cols-3 gap-x-3 gap-y-5 sm:grid-cols-4 sm:gap-x-5 sm:gap-y-8 lg:grid-cols-5 xl:grid-cols-6 2xl:grid-cols-7">
                {inCategory.map((wrestler) => (
                  <li key={wrestler.id}>
                    <button
                      type="button"
                      onClick={() => {
                        setSelectedId(wrestler.id);
                        setOpenSection(null);
                      }}
                      className="group flex w-full flex-col items-center gap-2 text-center sm:gap-2.5"
                    >
                      <span className="relative block aspect-square w-full max-w-none overflow-hidden bg-[#111] sm:max-w-[7.5rem]">
                        {wrestler.photos[0] ? (
                          <Image
                            src={wrestler.photos[0]}
                            alt=""
                            fill
                            unoptimized
                            quality={100}
                            className="object-cover object-[center_12%]"
                            sizes="120px"
                          />
                        ) : (
                          <span className="absolute inset-0 flex items-center justify-center px-2 text-[0.55rem] uppercase tracking-wider text-uwa-white/30">
                            {copy.photoSoon}
                          </span>
                        )}
                      </span>
                      <span className="line-clamp-2 max-w-full text-[11px] leading-snug text-uwa-white/90 group-hover:text-uwa-white sm:max-w-[7.5rem] sm:text-xs">
                        {pick(wrestler.name, locale)}
                      </span>
                    </button>
                  </li>
                ))}
              </ul>
            ) : null}
          </div>
        </div>
      </div>

      {selected && (
        <WrestlerDialog
          wrestler={selected}
          locale={locale}
          copy={copy}
          openSection={openSection}
          onToggle={setOpenSection}
          onClose={() => {
            setSelectedId(null);
            setOpenSection(null);
          }}
        />
      )}

      <SocialRail />
    </section>
  );
}

function WrestlerDialog({
  wrestler,
  locale,
  copy,
  openSection,
  onToggle,
  onClose,
}: {
  wrestler: Wrestler;
  locale: string;
  copy: Copy;
  openSection: string | null;
  onToggle: (key: string | null) => void;
  onClose: () => void;
}) {
  const sections = [
    { key: "titles", label: copy.sections.titles, items: wrestler.titles },
    { key: "matches", label: copy.sections.matches, items: wrestler.matches },
    {
      key: "rivalries",
      label: copy.sections.rivalries,
      items: wrestler.rivalries,
    },
  ] as const;

  return (
    <div className="fixed inset-0 z-[60] flex items-center justify-center p-3 sm:p-4 lg:p-10">
      <button
        type="button"
        aria-label="Close"
        onClick={onClose}
        className="absolute inset-0 bg-black/75"
      />
      <div className="relative z-10 min-h-0 w-full max-w-6xl">
        <button
          type="button"
          onClick={onClose}
          className="absolute top-3 right-3 z-20 flex h-11 w-11 items-center justify-center rounded-full border border-white/50 bg-black/70 text-3xl leading-none text-uwa-white shadow-lg md:hidden"
          aria-label="Close"
        >
          ×
        </button>
        <div
          role="dialog"
          aria-modal="true"
          aria-labelledby="roster-dialog-title"
          className="grid max-h-[92dvh] min-h-0 overflow-y-auto overscroll-contain border border-[#6e6a6b] bg-uwa-black md:grid-cols-[minmax(22rem,32rem)_minmax(0,1fr)]"
        >
        <div className="relative h-[38vh] w-full shrink-0 bg-[#111] md:h-auto md:min-h-[36rem]">
          {wrestler.photos[0] ? (
            <Image
              src={wrestler.photos[0]}
              alt=""
              fill
              unoptimized
              quality={100}
              className="object-contain object-bottom p-2 md:p-4"
              sizes="512px"
            />
          ) : null}
        </div>
        <div className="flex flex-col px-4 py-4 sm:px-6 sm:py-6 md:px-8">
          <div className="flex items-start justify-between gap-4">
            <h2
              id="roster-dialog-title"
              className="font-heading text-2xl uppercase tracking-wide text-uwa-white sm:text-3xl"
            >
              {pick(wrestler.name, locale)}
            </h2>
            <button
              type="button"
              onClick={onClose}
              className="hidden text-2xl leading-none text-uwa-white/60 hover:text-uwa-white md:block"
              aria-label="Close"
            >
              ×
            </button>
          </div>
          <div className="mt-5 space-y-4 text-sm leading-relaxed text-uwa-white/55">
            {wrestler.bio.map((paragraph) => {
              const stats = /^\d+\s*см/.test(paragraph.ua);
              return (
                <p
                  key={paragraph.en}
                  className={stats ? "text-uwa-white/80" : undefined}
                >
                  {pick(paragraph, locale)}
                </p>
              );
            })}
          </div>
          {wrestler.category !== "managers" &&
            wrestler.category !== "referees" && (
            <div className="mt-8">
              {sections.slice(0, 2).map((section) => {
                const open = openSection === section.key;
                return (
                  <AccordionSection
                    key={section.key}
                    label={section.label}
                    open={open}
                    onToggle={() => onToggle(open ? null : section.key)}
                  >
                    <ul className="space-y-2 pb-4 text-sm text-uwa-white/55">
                      {section.items.map((item) => (
                        <li key={item.en}>{pick(item, locale)}</li>
                      ))}
                    </ul>
                  </AccordionSection>
                );
              })}
              <VideoSection
                label={copy.sections.videos}
                videos={wrestler.videos}
                locale={locale}
                open={openSection === "videos"}
                onToggle={() =>
                  onToggle(openSection === "videos" ? null : "videos")
                }
              />
              {sections.slice(2).map((section) => {
                const open = openSection === section.key;
                return (
                  <AccordionSection
                    key={section.key}
                    label={section.label}
                    open={open}
                    onToggle={() => onToggle(open ? null : section.key)}
                  >
                    <ul className="space-y-2 pb-4 text-sm text-uwa-white/55">
                      {section.items.map((item) => (
                        <li key={item.en}>{pick(item, locale)}</li>
                      ))}
                    </ul>
                  </AccordionSection>
                );
              })}
            </div>
          )}
        </div>
        </div>
      </div>
    </div>
  );
}

function AccordionSection({
  label,
  open,
  onToggle,
  children,
}: {
  label: string;
  open: boolean;
  onToggle: () => void;
  children: ReactNode;
}) {
  return (
    <div className="border-t border-uwa-white/15">
      <button
        type="button"
        onClick={onToggle}
        className="flex w-full items-center justify-between py-3.5 text-left text-sm font-medium uppercase tracking-wide text-uwa-white"
        aria-expanded={open}
      >
        {label}
        <ChevronDownIcon
          className={`h-4 w-4 text-uwa-white/70 transition-transform ${
            open ? "rotate-180" : ""
          }`}
        />
      </button>
      {open ? children : null}
    </div>
  );
}

function VideoSection({
  label,
  videos,
  locale,
  open,
  onToggle,
}: {
  label: string;
  videos: WrestlerVideo[];
  locale: string;
  open: boolean;
  onToggle: () => void;
}) {
  return (
    <AccordionSection label={label} open={open} onToggle={onToggle}>
      <ul className="space-y-4 pb-4 text-sm text-uwa-white/55">
        {videos.map((item, index) => {
          const caption = pick(item, locale);
          const embed = getVideoEmbed(item.url);
          return (
            <li key={`${item.url}-${item.en}-${index}`} className="space-y-2">
              {embed?.type === "youtube" ? (
                <div className="aspect-video overflow-hidden bg-black">
                  <iframe
                    src={`https://www.youtube-nocookie.com/embed/${embed.id}`}
                    title={caption || "YouTube"}
                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                    allowFullScreen
                    className="h-full w-full"
                  />
                </div>
              ) : null}
              {embed?.type === "vimeo" ? (
                <div className="aspect-video overflow-hidden bg-black">
                  <iframe
                    src={`https://player.vimeo.com/video/${embed.id}`}
                    title={caption || "Vimeo"}
                    allow="autoplay; fullscreen; picture-in-picture"
                    allowFullScreen
                    className="h-full w-full"
                  />
                </div>
              ) : null}
              {embed?.type === "file" ? (
                <video
                  src={embed.src}
                  controls
                  playsInline
                  className="w-full bg-black"
                />
              ) : null}
              {embed?.type === "link" ? (
                <a
                  href={embed.href}
                  target="_blank"
                  rel="noreferrer"
                  className="text-uwa-red underline-offset-2 hover:underline"
                >
                  {caption || embed.href}
                </a>
              ) : null}
              {caption && embed?.type !== "link" ? <p>{caption}</p> : null}
              {!embed && caption ? <p>{caption}</p> : null}
            </li>
          );
        })}
      </ul>
    </AccordionSection>
  );
}
