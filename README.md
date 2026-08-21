# UWA — Ukrainian Wrestling Arena

Official website for **UWA (Ukrainian Wrestling Arena)**, built with Next.js.

## Tech stack

- [Next.js](https://nextjs.org) (App Router, TypeScript)
- [Tailwind CSS v4](https://tailwindcss.com)
- [next-intl](https://next-intl.dev) for bilingual routing (Ukrainian `/ua/...` default, English `/en/...`)

## Getting started

```bash
npm install
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) — you'll be redirected to `/ua` (the default locale).

## Project structure

```
messages/              # UA / EN translation dictionaries
src/
  i18n/                 # next-intl routing, navigation helpers, request config
  proxy.ts              # locale detection/redirect (Next.js proxy, formerly middleware)
  app/[locale]/         # all routes, nested under the locale segment
    page.tsx            # Home (hero section)
    events/, roster/, titles/, matches/, news/, media/,
    universe/, academy/, shop/, about/   # placeholder "coming soon" routes
  components/
    layout/             # Header, Footer, nav link, language switcher, mobile menu
    home/               # Hero
    ui/                 # ComingSoonPage (shared placeholder)
  config/nav.ts          # single source of truth for nav items/routes
```

## Current status

This is the **foundation pass**: global layout, navigation, bilingual routing, and a
bold dark design system are in place. The Home page currently only has the hero
section. Every other section from the site plan (Events, Roster, Titles, Matches,
News, Media, Universe/Lore, Academy, Shop, About) is routed and rendered as a
"coming soon" placeholder, ready to be filled in with real content in later phases.

## Adding translations

Add new keys to both `messages/ua.json` and `messages/en.json`, then read them with
`useTranslations`/`getTranslations` from `next-intl`. Types for `next-intl` messages
are declared in [`global.d.ts`](global.d.ts).
