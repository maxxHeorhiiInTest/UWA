"use client";

import { useMemo, useState } from "react";
import Image from "next/image";
import { useLocale } from "next-intl";
import type { LocalizedText } from "@/config/roster";
import {
  academyCityIds,
  academyContactLinks,
  academyPhone,
  academyPhoneHref,
  academySchedule,
  type AcademyCityId,
  type AcademyTrainer,
} from "@/config/academy";
import { getVideoEmbed } from "@/lib/video";
import { track } from "@/lib/analytics";
import {
  CalendarIcon,
  ClockIcon,
  FacebookIcon,
  InstagramIcon,
  PlayIcon,
  YoutubeIcon,
} from "@/components/ui/Icons";

type Copy = {
  title: string;
  trainers: string;
  contacts: string;
  play: string;
  cities: Record<AcademyCityId, string>;
};

function pick(text: LocalizedText, locale: string) {
  return locale === "en" ? text.en : text.ua;
}

const networkIcons = {
  instagram: InstagramIcon,
  facebook: FacebookIcon,
  youtube: YoutubeIcon,
};

export function AcademyView({
  copy,
  trainers,
}: {
  copy: Copy;
  trainers: AcademyTrainer[];
}) {
  const locale = useLocale();
  const localeKey = locale === "en" ? "en" : "ua";
  const [cityId, setCityId] = useState<AcademyCityId>(
    trainers[0]?.cityId ?? "kyiv"
  );
  const [selectedId, setSelectedId] = useState(trainers[0]?.id ?? "");
  const [playing, setPlaying] = useState(false);

  const cityTrainers = useMemo(
    () => trainers.filter((trainer) => trainer.cityId === cityId),
    [cityId, trainers]
  );
  const selected =
    cityTrainers.find((trainer) => trainer.id === selectedId) ??
    cityTrainers[0];

  if (!selected) return null;

  const embed = selected.videoUrl ? getVideoEmbed(selected.videoUrl) : null;
  const canPlay =
    embed?.type === "youtube" ||
    embed?.type === "vimeo" ||
    embed?.type === "file";

  function selectCity(nextCity: AcademyCityId) {
    const nextTrainer = trainers.find((trainer) => trainer.cityId === nextCity);
    setCityId(nextCity);
    setSelectedId(nextTrainer?.id ?? "");
    setPlaying(false);
    track("select_content", {
      content_type: "academy_city",
      item_id: nextCity,
      item_name: copy.cities[nextCity],
    });
  }

  return (
    <section className="relative min-h-full bg-uwa-black">
      <div className="mx-auto flex w-full max-w-[1920px] flex-col px-4 py-8 sm:px-10 sm:py-10 lg:px-16 lg:py-12">
        <div className="flex flex-col gap-6 lg:flex-row lg:items-start lg:justify-between lg:gap-16">
          <h1 className="font-heading text-5xl tracking-wide text-uwa-white sm:text-7xl lg:text-[5.5rem] lg:leading-none">
            {copy.title}
          </h1>
          {selected.intro.ua || selected.intro.en ? (
            <p className="max-w-md text-sm leading-relaxed text-uwa-white/55 lg:pt-2">
              {pick(selected.intro, locale)}
            </p>
          ) : null}
        </div>

        <div className="mt-8 border-t border-uwa-white/15 pt-8 lg:mt-10 lg:pt-10">
          <div className="grid items-start gap-8 lg:grid-cols-[14.25rem_minmax(0,1fr)_minmax(0,1.15fr)] lg:grid-rows-[auto_1fr] lg:gap-x-14 lg:gap-y-8">
            <div className="-mx-4 flex shrink-0 gap-2 overflow-x-auto px-4 scrollbar-none sm:mx-0 sm:gap-3 sm:px-0 lg:col-start-1 lg:row-span-2 lg:flex-col lg:gap-3.5 lg:overflow-visible">
              {academyCityIds.map((id) => {
                const active = id === cityId;
                return (
                  <button
                    key={id}
                    type="button"
                    onClick={() => selectCity(id)}
                    className={`shrink-0 rounded-md px-4 py-2.5 text-xs font-medium uppercase tracking-wide transition-colors sm:px-8 sm:py-[1.125rem] sm:text-sm lg:w-full ${
                      active
                        ? "bg-uwa-red text-uwa-white"
                        : "border border-[#6d6d6d] text-uwa-white hover:border-uwa-white/70"
                    }`}
                  >
                    {copy.cities[id]}
                  </button>
                );
              })}
            </div>

            <div className="lg:col-start-2 lg:row-start-1">
              <h2 className="font-heading text-2xl tracking-wide text-uwa-white sm:text-[1.75rem]">
                {copy.trainers}
              </h2>

              <ul className="mt-5 flex gap-5 sm:mt-6 sm:gap-6">
                {cityTrainers.map((trainer) => {
                  const active = trainer.id === selected.id;
                  return (
                    <li key={trainer.id}>
                      <button
                        type="button"
                        onClick={() => {
                          setSelectedId(trainer.id);
                          setPlaying(false);
                          track("select_content", {
                            content_type: "trainer",
                            item_id: trainer.id,
                            item_name: pick(trainer.name, locale),
                            item_category: trainer.cityId,
                          });
                        }}
                        className="group w-24 text-left sm:w-28"
                      >
                        <span
                          className={`relative block aspect-square overflow-hidden bg-[#111] ${
                            active
                              ? "ring-1 ring-uwa-white"
                              : "ring-1 ring-transparent group-hover:ring-uwa-white/40"
                          }`}
                        >
                          <Image
                            key={trainer.photo}
                            src={trainer.photo}
                            alt={pick(trainer.name, locale)}
                            fill
                            unoptimized
                            quality={100}
                            priority
                            className="object-cover object-[center_top]"
                            sizes="112px"
                          />
                        </span>
                        <span className="mt-2 block text-center text-[11px] leading-snug text-uwa-white/80 sm:text-xs">
                          {pick(trainer.name, locale)}
                        </span>
                      </button>
                    </li>
                  );
                })}
              </ul>
            </div>

            <div className="relative aspect-video w-full overflow-hidden bg-[#111] lg:col-start-3 lg:row-span-2 lg:self-start">
              {playing && embed?.type === "youtube" ? (
                <iframe
                  src={`https://www.youtube-nocookie.com/embed/${embed.id}?autoplay=1&playsinline=1&fs=0&rel=0&modestbranding=1`}
                  title={copy.play}
                  allow="autoplay; encrypted-media"
                  className="absolute inset-0 h-full w-full"
                />
              ) : playing && embed?.type === "vimeo" ? (
                <iframe
                  src={`https://player.vimeo.com/video/${embed.id}?autoplay=1&playsinline=1&fullscreen=0&pip=0`}
                  title={copy.play}
                  allow="autoplay"
                  className="absolute inset-0 h-full w-full"
                />
              ) : playing && embed?.type === "file" ? (
                <video
                  src={embed.src}
                  controls
                  autoPlay
                  playsInline
                  disablePictureInPicture
                  controlsList="nofullscreen nodownload noremoteplayback"
                  className="absolute inset-0 h-full w-full object-contain bg-black"
                />
              ) : (
                <>
                  <Image
                    key={selected.photo}
                    src={selected.photo}
                    alt={pick(selected.name, locale)}
                    fill
                    unoptimized
                    quality={100}
                    className="h-full w-full object-cover object-[center_top]"
                    sizes="(max-width: 1024px) 100vw, 46vw"
                    priority
                  />
                  {canPlay ? (
                    <button
                      type="button"
                      onClick={() => {
                        setPlaying(true);
                        track("video_start", {
                          video_title: pick(selected.name, locale),
                          item_id: selected.id,
                        });
                      }}
                      className="absolute left-1/2 top-1/2 flex h-16 w-16 -translate-x-1/2 -translate-y-1/2 items-center justify-center rounded-full bg-black/35 text-uwa-white ring-1 ring-white/35 backdrop-blur-[2px] transition-colors hover:bg-black/50 sm:h-[5.5rem] sm:w-[5.5rem]"
                      aria-label={copy.play}
                    >
                      <PlayIcon className="ml-1 h-7 w-7 sm:h-9 sm:w-9" />
                    </button>
                  ) : (
                    <span
                      className="pointer-events-none absolute left-1/2 top-1/2 flex h-16 w-16 -translate-x-1/2 -translate-y-1/2 items-center justify-center rounded-full bg-black/35 text-uwa-white ring-1 ring-white/35 backdrop-blur-[2px] sm:h-[5.5rem] sm:w-[5.5rem]"
                      aria-hidden
                    >
                      <PlayIcon className="ml-1 h-7 w-7 sm:h-9 sm:w-9" />
                    </span>
                  )}
                </>
              )}
            </div>

            <div className="lg:col-start-2 lg:row-start-2">
              <h3 className="font-heading text-2xl uppercase tracking-wide text-uwa-white sm:text-[1.85rem]">
                {pick(selected.name, locale)}
              </h3>
              <div className="mt-3 max-w-lg space-y-3 text-sm leading-relaxed text-uwa-white/55">
                {selected.intro.ua || selected.intro.en ? (
                  <p>{pick(selected.intro, locale)}</p>
                ) : null}
                {selected.bio.map((paragraph) => (
                  <p key={`${paragraph.ua}-${paragraph.en}`}>
                    {pick(paragraph, locale)}
                  </p>
                ))}
              </div>

              <div className="mt-6 flex max-w-lg overflow-x-auto divide-x divide-uwa-white/15 border border-uwa-white/15">
                <div className="flex min-w-[3.75rem] shrink-0 flex-col items-center justify-center gap-1 px-3 py-3 text-uwa-white/80">
                  <CalendarIcon className="h-5 w-5" />
                  <span className="text-sm font-medium">
                    {academySchedule.calendarMark}
                  </span>
                </div>
                <div className="flex flex-1 items-center justify-center gap-2.5 px-3 py-3 text-xs font-medium uppercase tracking-wide text-uwa-white sm:gap-3 sm:text-sm">
                  {academySchedule.days[localeKey].map((day) => (
                    <span key={day}>{day}</span>
                  ))}
                </div>
                <div className="flex shrink-0 items-center justify-center px-3 py-3 text-uwa-white/80 sm:px-4">
                  <ClockIcon className="h-5 w-5" />
                </div>
                <div className="flex shrink-0 items-center justify-center whitespace-nowrap px-3 py-3 text-xs font-medium tracking-wide text-uwa-white sm:px-4 sm:text-sm">
                  {academySchedule.time}
                </div>
              </div>

              <div className="mt-8">
                <h4 className="text-xs font-medium uppercase tracking-wide text-uwa-white/70">
                  {copy.contacts}
                </h4>
                <div className="mt-3 flex flex-wrap items-center gap-3">
                  {academyContactLinks.map((link) => {
                    const Icon = networkIcons[link.network];
                    return (
                      <a
                        key={link.network}
                        href={link.href}
                        target="_blank"
                        rel="noopener noreferrer"
                        aria-label={link.label}
                        className="flex h-10 w-10 items-center justify-center border border-uwa-white/20 text-uwa-white/80 transition-colors hover:border-uwa-white hover:text-uwa-white"
                      >
                        <Icon className="h-4 w-4" />
                      </a>
                    );
                  })}
                  <a
                    href={academyPhoneHref}
                    className="pl-1 text-sm tracking-wide text-uwa-white/85 hover:text-uwa-white"
                  >
                    {academyPhone}
                  </a>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
