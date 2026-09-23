"use client";

import { useEffect, useMemo, useState } from "react";
import Image from "next/image";
import { useLocale } from "next-intl";
import {
  rosterCategories,
  wrestlers,
  type LocalizedText,
  type RosterCategory,
  type Wrestler,
} from "@/config/roster";
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

export function RosterView({ copy }: { copy: Copy }) {
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
      <div className="mx-auto flex min-h-0 w-full max-w-[1920px] flex-1 flex-col px-4 pt-8 sm:px-10 lg:px-16 lg:pt-10 lg:pr-24">
        <h1 className="shrink-0 font-heading text-5xl tracking-wide text-uwa-white sm:text-6xl lg:text-[4.35rem] lg:leading-none">
          {copy.title}
        </h1>

        <div className="mt-8 flex min-h-0 flex-1 flex-col gap-8 lg:mt-10 lg:flex-row lg:items-stretch lg:gap-14">
          <div className="flex shrink-0 gap-3 overflow-x-auto scrollbar-none lg:w-[14.25rem] lg:flex-col lg:gap-3.5 lg:overflow-visible">
            {rosterCategories.map((key) => {
              const active = key === category;
              return (
                <button
                  key={key}
                  type="button"
                  onClick={() => setCategory(key)}
                  className={`shrink-0 rounded-md px-8 py-[1.125rem] text-sm font-medium uppercase tracking-wide transition-colors lg:w-full ${
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

          <div className="min-h-0 min-w-0 flex-1 overflow-y-auto pb-10 border-r-0 lg:border-r lg:border-uwa-red/80 lg:pr-10">
            {inCategory.length > 0 ? (
              <ul className="grid grid-cols-3 gap-x-5 gap-y-8 sm:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 2xl:grid-cols-7">
                {inCategory.map((wrestler) => (
                  <li key={wrestler.id}>
                    <button
                      type="button"
                      onClick={() => {
                        setSelectedId(wrestler.id);
                        setOpenSection(null);
                      }}
                      className="group flex w-full flex-col items-center gap-2.5 text-center"
                    >
                      <span className="relative block aspect-square w-full max-w-[7.5rem] overflow-hidden bg-[#111]">
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
                      <span className="line-clamp-2 max-w-[7.5rem] text-xs leading-snug text-uwa-white/90 group-hover:text-uwa-white">
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
    { key: "videos", label: copy.sections.videos, items: wrestler.videos },
    {
      key: "rivalries",
      label: copy.sections.rivalries,
      items: wrestler.rivalries,
    },
  ] as const;

  return (
    <div className="fixed inset-0 z-[60] flex items-center justify-center p-4 lg:p-10">
      <button
        type="button"
        aria-label="Close"
        onClick={onClose}
        className="absolute inset-0 bg-black/75"
      />
      <div
        role="dialog"
        aria-modal="true"
        aria-labelledby="roster-dialog-title"
        className="relative z-10 grid max-h-[92vh] w-full max-w-6xl overflow-y-auto border border-[#6e6a6b] bg-uwa-black md:grid-cols-[minmax(22rem,32rem)_minmax(0,1fr)]"
      >
        <div className="relative aspect-[3/4] w-full bg-[#111] md:aspect-auto md:min-h-[36rem]">
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
        <div className="flex flex-col px-6 py-6 md:px-8">
          <div className="flex items-start justify-between gap-4">
            <h2
              id="roster-dialog-title"
              className="font-heading text-3xl uppercase tracking-wide text-uwa-white"
            >
              {pick(wrestler.name, locale)}
            </h2>
            <button
              type="button"
              onClick={onClose}
              className="text-2xl leading-none text-uwa-white/60 hover:text-uwa-white"
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
          {wrestler.category !== "managers" && (
            <div className="mt-8">
              {sections.map((section) => {
                const open = openSection === section.key;
                return (
                  <div key={section.key} className="border-t border-uwa-white/15">
                    <button
                      type="button"
                      onClick={() => onToggle(open ? null : section.key)}
                      className="flex w-full items-center justify-between py-3.5 text-left text-sm font-medium uppercase tracking-wide text-uwa-white"
                      aria-expanded={open}
                    >
                      {section.label}
                      <ChevronDownIcon
                        className={`h-4 w-4 text-uwa-white/70 transition-transform ${
                          open ? "rotate-180" : ""
                        }`}
                      />
                    </button>
                    {open && (
                      <ul className="space-y-2 pb-4 text-sm text-uwa-white/55">
                        {section.items.map((item) => (
                          <li key={item.en}>{pick(item, locale)}</li>
                        ))}
                      </ul>
                    )}
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
