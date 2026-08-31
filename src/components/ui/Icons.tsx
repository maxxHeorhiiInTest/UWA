import type { SVGProps } from "react";

// Tag-with-star badge used on the "tickets" buttons — matches the Figma
// component exactly: a white rounded square with a star punched out in the
// button's own red, so the star reads as a cutout rather than a solid fill.
export function TicketBadgeIcon(props: SVGProps<SVGSVGElement>) {
  return (
    <svg
      viewBox="0 0 24 24"
      xmlns="http://www.w3.org/2000/svg"
      aria-hidden
      {...props}
    >
      <rect x="2" y="2" width="20" height="20" rx="5" fill="#fff" />
      <path
        d="M12 6.2 13.4 10 17.4 10 14.2 12.4 15.4 16.2 12 13.9 8.6 16.2 9.8 12.4 6.6 10 10.6 10Z"
        fill="var(--uwa-red)"
      />
    </svg>
  );
}

export function SparkleIcon(props: SVGProps<SVGSVGElement>) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="currentColor"
      xmlns="http://www.w3.org/2000/svg"
      aria-hidden
      {...props}
    >
      <path d="M12 0c.6 3.6 1.3 6 2.5 7.5S18 10.4 24 12c-6 1.6-8.3 2.9-9.5 4.5S12.6 20.4 12 24c-.6-3.6-1.3-6-2.5-7.5S6 13.6 0 12c6-1.6 8.3-2.9 9.5-4.5S11.4 3.6 12 0Z" />
    </svg>
  );
}

export function ArrowRightIcon(props: SVGProps<SVGSVGElement>) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth={2}
      strokeLinecap="round"
      strokeLinejoin="round"
      xmlns="http://www.w3.org/2000/svg"
      aria-hidden
      {...props}
    >
      <path d="M5 12h14M13 6l6 6-6 6" />
    </svg>
  );
}

export function FacebookIcon(props: SVGProps<SVGSVGElement>) {
  return (
    <svg viewBox="0 0 24 24" fill="currentColor" xmlns="http://www.w3.org/2000/svg" aria-hidden {...props}>
      <path d="M13.5 21v-8h2.7l.4-3.1h-3.1V8c0-.9.25-1.5 1.55-1.5H16.7V3.7C16.4 3.66 15.4 3.57 14.24 3.57c-2.3 0-3.87 1.4-3.87 3.98v2.34H7.66V13H10.4v8h3.1Z" />
    </svg>
  );
}

export function InstagramIcon(props: SVGProps<SVGSVGElement>) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth={1.8}
      xmlns="http://www.w3.org/2000/svg"
      aria-hidden
      {...props}
    >
      <rect x="3.5" y="3.5" width="17" height="17" rx="4.5" />
      <circle cx="12" cy="12" r="4" />
      <circle cx="17.2" cy="6.8" r="1" fill="currentColor" stroke="none" />
    </svg>
  );
}

export function YoutubeIcon(props: SVGProps<SVGSVGElement>) {
  return (
    <svg viewBox="0 0 24 24" fill="currentColor" xmlns="http://www.w3.org/2000/svg" aria-hidden {...props}>
      <path d="M21.6 7.7a2.7 2.7 0 0 0-1.9-1.9C18 5.3 12 5.3 12 5.3s-6 0-7.7.5A2.7 2.7 0 0 0 2.4 7.7 28 28 0 0 0 2 12a28 28 0 0 0 .4 4.3 2.7 2.7 0 0 0 1.9 1.9c1.7.5 7.7.5 7.7.5s6 0 7.7-.5a2.7 2.7 0 0 0 1.9-1.9A28 28 0 0 0 22 12a28 28 0 0 0-.4-4.3ZM10 15V9l5.2 3-5.2 3Z" />
    </svg>
  );
}

export function TikTokIcon(props: SVGProps<SVGSVGElement>) {
  return (
    <svg viewBox="0 0 24 24" fill="currentColor" xmlns="http://www.w3.org/2000/svg" aria-hidden {...props}>
      <path d="M16.6 2h-3.2v13.7a3 3 0 1 1-2.4-2.9v-3.3a6.3 6.3 0 1 0 5.6 6.3V8.9a7.9 7.9 0 0 0 4.4 1.3V7a4.6 4.6 0 0 1-4.4-5Z" />
    </svg>
  );
}

export function TelegramIcon(props: SVGProps<SVGSVGElement>) {
  return (
    <svg viewBox="0 0 24 24" fill="currentColor" xmlns="http://www.w3.org/2000/svg" aria-hidden {...props}>
      <path d="m21.4 3.3-3 15.2c-.2 1-.9 1.2-1.7.8l-4.7-3.5-2.3 2.2c-.2.2-.5.4-.9.4l.3-4.6L18 5.9c.4-.3-.1-.5-.6-.2L7.2 12.4l-4.5-1.4c-1-.3-1-1 .2-1.5L20 2.7c.8-.3 1.6.2 1.4 1Z" />
    </svg>
  );
}

export function XIcon(props: SVGProps<SVGSVGElement>) {
  return (
    <svg viewBox="0 0 24 24" fill="currentColor" xmlns="http://www.w3.org/2000/svg" aria-hidden {...props}>
      <path d="M17.5 3h3.2l-7 8 8.2 10h-6.4l-5-6.5L4.3 21H1.1l7.5-8.6L.8 3h6.5l4.6 6ZM16.3 19.2h1.8L7.8 4.7H5.9l10.4 14.5Z" />
    </svg>
  );
}
