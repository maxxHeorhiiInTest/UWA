import Image from "next/image";
import { getTranslations } from "next-intl/server";
import { externalLinks } from "@/config/links";
import {
  ArrowRightIcon,
  FacebookIcon,
  InstagramIcon,
  TikTokIcon,
  XIcon,
  YoutubeIcon,
} from "@/components/ui/Icons";

const socialLinks = [
  { label: "Facebook", href: externalLinks.facebook, Icon: FacebookIcon },
  { label: "Instagram", href: externalLinks.instagram, Icon: InstagramIcon },
  { label: "YouTube", href: externalLinks.youtube, Icon: YoutubeIcon },
  { label: "TikTok", href: externalLinks.tiktok, Icon: TikTokIcon },
  { label: "X", href: externalLinks.twitter, Icon: XIcon },
];

export async function Hero() {
  const [t, tFooter] = await Promise.all([
    getTranslations("home"),
    getTranslations("footer"),
  ]);

  return (
    <section className="relative h-full overflow-hidden bg-uwa-black">
      {/* Ambient background texture — a faint technical grid plus soft
          smoke/fire glow that continues the mood of the hero photo into
          the area behind the heading. The exported photo can't be shown
          there directly (its pixels bake in the page's own text and
          button at full opacity), so this reconstructs the same
          atmosphere with plain CSS gradients instead of a flat block of
          black. */}
      <div
        className="absolute inset-0"
        style={{
          backgroundImage:
            "linear-gradient(rgba(255,255,255,0.05) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.05) 1px, transparent 1px), radial-gradient(45% 55% at 26% 60%, rgba(190,190,190,0.10), transparent 70%), radial-gradient(38% 48% at 14% 28%, rgba(190,190,190,0.07), transparent 70%), radial-gradient(55% 65% at 58% 78%, rgba(255,99,23,0.20), transparent 70%), radial-gradient(50% 60% at 68% 48%, rgba(214,0,61,0.16), transparent 70%)",
          backgroundSize:
            "80px 80px, 80px 80px, 100% 100%, 100% 100%, 100% 100%, 100% 100%",
        }}
        aria-hidden
      />

      {/* Hero photography exported directly from the Figma file (the
          wrestler + fire/lightning composite), cropped only to remove the
          header strip and the baked-in fake UI at the edges — the full
          width of the composite is kept so all three wrestlers land in the
          same positions as the Figma design. Faded into the page
          background on the left so the bilingual heading text stays
          legible over a plain dark backdrop. */}
      <div
        className="absolute inset-0"
        style={{
          maskImage:
            "linear-gradient(to right, transparent 0%, transparent 36%, black 54%)",
          WebkitMaskImage:
            "linear-gradient(to right, transparent 0%, transparent 36%, black 54%)",
        }}
        aria-hidden
      >
        <Image
          src="/hero-photo-v3.jpg"
          alt=""
          fill
          priority
          className="object-cover"
          style={{ objectPosition: "center top" }}
          sizes="100vw"
        />
      </div>

      <div className="relative mx-auto flex h-full max-w-[1920px] flex-col justify-center px-4 py-10 sm:px-10 lg:px-16">
        <h1 className="font-heading text-5xl leading-[1.02] tracking-wide text-uwa-white sm:text-6xl lg:text-7xl">
          <span className="block">{t("titleLine1")}</span>
          <span className="block">{t("titleLine2")}</span>
          <span className="block">{t("titleLine3")}</span>
        </h1>

        <p className="mt-6 max-w-sm text-sm text-uwa-white/70 sm:text-base">
          {t("subtitle")}
        </p>

        <a
          href={externalLinks.tickets}
          target="_blank"
          rel="noopener noreferrer"
          className="mt-8 inline-flex w-fit items-center gap-2.5 bg-uwa-red px-6 py-3.5 text-sm font-bold uppercase tracking-wide text-uwa-white transition-colors hover:bg-uwa-red-dark"
        >
          {t("ctaPrimary")}
          <ArrowRightIcon className="h-4 w-4" />
        </a>
      </div>

      {/* Vertical social rail, right edge — each icon sits in its own dark
          tile, stacked with no gap, matching the Figma component. */}
      <div className="absolute right-0 top-1/2 hidden -translate-y-1/2 flex-col lg:flex">
        {socialLinks.map((social) => (
          <a
            key={social.label}
            href={social.href}
            target="_blank"
            rel="noopener noreferrer"
            aria-label={social.label}
            className="flex h-11 w-11 items-center justify-center bg-black text-uwa-white/70 transition-colors hover:bg-uwa-red hover:text-uwa-white"
          >
            <social.Icon className="h-4 w-4" />
          </a>
        ))}
      </div>

      <p className="absolute bottom-3 left-4 text-[11px] text-uwa-white/40 sm:left-10 lg:left-16">
        {tFooter("rights", { year: new Date().getFullYear() })}
      </p>
    </section>
  );
}
