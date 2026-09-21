import { externalLinks } from "@/config/links";
import {
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

export function SocialRail() {
  return (
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
  );
}
