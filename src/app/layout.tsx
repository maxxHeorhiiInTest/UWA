import type { Metadata, Viewport } from "next";
import { Inter, Russo_One } from "next/font/google";
import { getSiteUrl, siteName, siteShortName } from "@/config/site";
import "./globals.css";

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin", "latin-ext", "cyrillic"],
});

const russoOne = Russo_One({
  variable: "--font-russo-one",
  weight: "400",
  subsets: ["latin", "cyrillic"],
});

export const metadata: Metadata = {
  metadataBase: new URL(getSiteUrl()),
  applicationName: siteShortName,
  title: {
    default: siteName,
    template: `%s | ${siteShortName}`,
  },
  description:
    "UWA — Ukrainian Wrestling Arena: український рестлінг-промоушен. Ростер, академія, квитки на шоу та новини арени.",
  icons: { icon: "/icon.svg" },
};

export const viewport: Viewport = {
  themeColor: "#0a0a0a",
  colorScheme: "dark",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html
      lang="uk"
      className={`${inter.variable} ${russoOne.variable} h-full antialiased`}
    >
      <body className="h-dvh flex flex-col overflow-hidden bg-uwa-black text-uwa-white font-sans">
        {children}
      </body>
    </html>
  );
}
