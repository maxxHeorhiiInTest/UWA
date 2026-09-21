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
import {
  ChevronDownIcon,
  ChevronLeftIcon,
  ChevronRightIcon,
} from "@/components/ui/Icons";

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

const PHOTO_SLOTS = 4;
const PORTRAIT_HUD = "12.5%";
const THUMB_WINDOW = 6;

const initialWrestler =
  [...wrestlers].reverse().find((wrestler) => wrestler.photos.length > 0) ??
  wrestlers[0];

function thumbStartFor(list: Wrestler[], selectedId: string) {
  const index = list.findIndex((wrestler) => wrestler.id === selectedId);
  if (index < 0) return 0;
  return Math.max(0, Math.min(index - THUMB_WINDOW + 1, Math.max(0, list.length - THUMB_WINDOW)));
}

export function RosterView({ copy }: { copy: Copy }) {
  const locale = useLocale();
  const [category, setCategory] = useState<RosterCategory>(
    initialWrestler.category
  );
  const [selectedId, setSelectedId] = useState(initialWrestler.id);
  const [photoIndex, setPhotoIndex] = useState(0);
  const [thumbStart, setThumbStart] = useState(() =>
    thumbStartFor(
      sortByLocalizedName(
        wrestlers.filter((wrestler) => wrestler.category === initialWrestler.category),
        locale
      ),
      initialWrestler.id
    )
  );
  const [openSection, setOpenSection] = useState<string | null>(null);

  const inCategory = useMemo(
    () =>
      sortByLocalizedName(
        wrestlers.filter((wrestler) => wrestler.category === category),
        locale
      ),
    [category, locale]
  );

  useEffect(() => {
    setThumbStart(thumbStartFor(inCategory, selectedId));
    // eslint-disable-next-line react-hooks/exhaustive-deps -- only re-window when locale or category changes
  }, [locale, category]);

  const selected =
    inCategory.find((wrestler) => wrestler.id === selectedId) ?? inCategory[0];

  useEffect(() => {
    if (!inCategory.some((wrestler) => wrestler.id === selectedId)) {
      setSelectedId(inCategory[0]?.id ?? "");
      setThumbStart(0);
      setPhotoIndex(0);
      setOpenSection(null);
    }
  }, [category, inCategory, selectedId]);

  const visibleThumbs = inCategory.slice(thumbStart, thumbStart + THUMB_WINDOW);
  const canPrev = thumbStart > 0;
  const canNext = thumbStart + THUMB_WINDOW < inCategory.length;
  const photoCount = selected
    ? selected.photos.length > 0
      ? selected.photos.length
      : PHOTO_SLOTS
    : 0;
  const photoSrc = selected?.photos[photoIndex];

  return (
    <section className="relative min-h-full bg-uwa-black lg:h-full lg:overflow-y-auto">
      <div className="mx-auto grid max-w-[1920px] grid-cols-1 gap-8 px-4 py-8 sm:px-10 lg:grid-cols-[15.5rem_minmax(22rem,26rem)_minmax(0,1fr)] lg:grid-rows-[auto_auto_auto] lg:items-start lg:gap-x-12 lg:gap-y-6 lg:px-16 lg:py-8 lg:pr-24">
        <h1 className="font-heading text-5xl tracking-wide text-uwa-white sm:text-6xl lg:pb-6 lg:text-[4.35rem] lg:leading-none">
          {copy.title}
        </h1>
        <div className="hidden lg:block" />
        <div className="hidden lg:block" />

        <div className="flex flex-col">
          <div className="flex gap-3 overflow-x-auto scrollbar-none lg:flex-col lg:gap-3.5 lg:overflow-visible">
            {rosterCategories.map((key) => {
              const active = key === category;
              return (
                <button
                  key={key}
                  type="button"
                  onClick={() => setCategory(key)}
                  className={`shrink-0 rounded-md px-8 py-[1.125rem] text-sm font-medium uppercase tracking-wide transition-colors lg:w-[14.25rem] ${
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
        </div>

        {selected ? (
          <WrestlerPortrait
            wrestler={selected}
            photoSrc={photoSrc}
            photoIndex={photoIndex}
            photoCount={photoCount}
            photoSoon={copy.photoSoon}
            onSelectPhoto={setPhotoIndex}
          />
        ) : (
          <div className="relative mx-auto aspect-[3/4] w-full max-w-sm overflow-hidden border border-[#6e6a6b] lg:mx-0 lg:max-w-none">
            <div
              className="absolute inset-0"
              style={{
                background:
                  "radial-gradient(80% 70% at 50% 30%, #6a1028 0%, #1a050c 55%, #0a0a0a 100%)",
              }}
            />
          </div>
        )}

        {selected ? (
          <WrestlerDetails
            wrestler={selected}
            locale={locale}
            copy={copy}
            openSection={openSection}
            onToggle={setOpenSection}
          />
        ) : (
          <div />
        )}

        <div className="flex items-center gap-4 lg:col-span-2 lg:col-start-2">
          <button
            type="button"
            aria-label="Previous"
            disabled={!canPrev}
            onClick={() => setThumbStart((start) => Math.max(0, start - 1))}
            className="flex h-10 w-10 shrink-0 items-center justify-center text-uwa-white/80 transition-colors hover:text-uwa-white disabled:text-uwa-white/20"
          >
            <ChevronLeftIcon className="h-7 w-7" />
          </button>

          <div className="flex items-center gap-4">
            {visibleThumbs.map((wrestler) => {
              const active = wrestler.id === selected?.id;
              return (
                <button
                  key={wrestler.id}
                  type="button"
                  onClick={() => {
                    setSelectedId(wrestler.id);
                    setPhotoIndex(0);
                    setOpenSection(null);
                  }}
                  className={`relative h-[5.75rem] w-[5.75rem] shrink-0 overflow-hidden border-2 ${
                    active ? "border-uwa-red" : "border-transparent"
                  }`}
                  aria-label={pick(wrestler.name, locale)}
                >
                  <PortraitFill
                    wrestler={wrestler}
                    photoSrc={wrestler.photos[0]}
                    photoSoon={copy.photoSoon}
                    compact
                  />
                </button>
              );
            })}
          </div>

          <button
            type="button"
            aria-label="Next"
            disabled={!canNext}
            onClick={() =>
              setThumbStart((start) =>
                Math.min(inCategory.length - THUMB_WINDOW, start + 1)
              )
            }
            className="flex h-10 w-10 shrink-0 items-center justify-center text-uwa-white/80 transition-colors hover:text-uwa-white disabled:text-uwa-white/20"
          >
            <ChevronRightIcon className="h-7 w-7" />
          </button>
        </div>
      </div>

      <SocialRail />
    </section>
  );
}

function WrestlerPortrait({
  wrestler,
  photoSrc,
  photoIndex,
  photoCount,
  photoSoon,
  onSelectPhoto,
}: {
  wrestler: Wrestler;
  photoSrc?: string;
  photoIndex: number;
  photoCount: number;
  photoSoon: string;
  onSelectPhoto: (index: number) => void;
}) {
  const selectPhoto = (index: number) => {
    if (index < photoCount) onSelectPhoto(index);
  };

  return (
    <div className="relative mx-auto aspect-[3/4] w-full max-w-sm overflow-hidden border border-[#6e6a6b] lg:mx-0 lg:max-w-none">
      <PortraitFill
        wrestler={wrestler}
        photoSrc={photoSrc}
        photoSoon={photoSoon}
        seed={photoIndex}
        photoClipBottom={PORTRAIT_HUD}
      />

      <div className="pointer-events-none absolute inset-x-0 bottom-0 z-20 h-[12.5%]">
        <div className="absolute -top-3 inset-x-0 h-3 bg-gradient-to-b from-transparent to-[#18060c]" />
        <div className="absolute inset-0 bg-[#18060c]" />
        <div
          className="absolute inset-0 opacity-80"
          style={{
            backgroundImage:
              "radial-gradient(circle, rgba(214,80,100,0.38) 1.15px, transparent 1.4px)",
            backgroundSize: "22px 22px",
          }}
        />
        <div className="absolute inset-x-[5%] top-0 h-[2px] bg-uwa-red" />
        <PhotoDots
          count={PHOTO_SLOTS}
          active={photoIndex}
          onSelect={selectPhoto}
          className="pointer-events-auto absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2"
        />
      </div>

      <span className="pointer-events-none absolute left-5 top-5 z-30 h-6 w-6 border-l-[3px] border-t-[3px] border-uwa-red" />
      <span className="pointer-events-none absolute right-5 top-5 z-30 h-6 w-6 border-r-[3px] border-t-[3px] border-uwa-red" />
      <span className="pointer-events-none absolute bottom-5 left-5 z-30 h-6 w-6 border-b-[3px] border-l-[3px] border-uwa-red" />
      <span className="pointer-events-none absolute bottom-5 right-5 z-30 h-6 w-6 border-b-[3px] border-r-[3px] border-uwa-red" />

      <PhotoDots
        count={PHOTO_SLOTS}
        active={photoIndex}
        onSelect={selectPhoto}
        className="absolute left-1/2 top-5 z-30 -translate-x-1/2"
      />
    </div>
  );
}

function PortraitFill({
  wrestler,
  photoSrc,
  photoSoon,
  compact = false,
  seed = 0,
  photoClipBottom,
}: {
  wrestler: Wrestler;
  photoSrc?: string;
  photoSoon: string;
  compact?: boolean;
  seed?: number;
  photoClipBottom?: string;
}) {
  const shift = (seed % 4) * 8;

  return (
    <div className="relative h-full w-full">
      <div
        className="absolute inset-0"
        style={{
          background: `radial-gradient(80% 70% at 50% ${30 + shift}%, #6a1028 0%, #1a050c 55%, #0a0a0a 100%)`,
        }}
      />
      <div
        className="absolute inset-0 z-0 opacity-40"
        style={{
          backgroundImage:
            "linear-gradient(rgba(214,0,61,0.35) 1px, transparent 1px), linear-gradient(90deg, rgba(214,0,61,0.35) 1px, transparent 1px)",
          backgroundSize: compact ? "18px 18px" : "36px 36px",
        }}
      />
      {photoSrc && (
        <div
          className="absolute inset-0 z-10"
          style={
            photoClipBottom
              ? { clipPath: `inset(0 0 ${photoClipBottom} 0)` }
              : undefined
          }
        >
          <div
            className={
              compact
                ? "absolute inset-0"
                : "absolute inset-x-[5%] top-[11%] bottom-[16%]"
            }
          >
            <Image
              src={photoSrc}
              alt=""
              fill
              unoptimized
              quality={100}
              className={`z-10 ${
                compact ? "object-cover object-top" : "object-contain object-bottom"
              }`}
              sizes="(min-width: 1024px) 832px, 100vw"
            />
          </div>
        </div>
      )}
      {!photoSrc && (
        !compact && (
          <p className="absolute inset-0 flex items-center justify-center px-6 text-center text-xs uppercase tracking-[0.2em] text-uwa-white/35">
            {photoSoon}
          </p>
        )
      )}
      <span className="sr-only">{wrestler.id}</span>
    </div>
  );
}

function PhotoDots({
  count,
  onSelect,
  className,
}: {
  count: number;
  active: number;
  onSelect: (index: number) => void;
  className: string;
}) {
  return (
    <div className={`flex items-center gap-3 ${className}`}>
      {Array.from({ length: count }, (_, index) => (
        <button
          key={index}
          type="button"
          aria-label={`Photo ${index + 1}`}
          onClick={() => onSelect(index)}
          className="h-2 w-2 bg-uwa-red"
        />
      ))}
    </div>
  );
}

function WrestlerDetails({
  wrestler,
  locale,
  copy,
  openSection,
  onToggle,
}: {
  wrestler: Wrestler;
  locale: string;
  copy: Copy;
  openSection: string | null;
  onToggle: (key: string | null) => void;
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
    <div className="flex min-h-0 flex-col justify-start pb-2 lg:pt-1">
      <h2 className="font-heading text-3xl uppercase tracking-wide text-uwa-white lg:text-4xl">
        {pick(wrestler.name, locale)}
      </h2>

      <div className="mt-5 max-w-xl space-y-4 text-sm leading-relaxed text-uwa-white/55">
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
        <div className="mt-8 max-w-xl">
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
  );
}
