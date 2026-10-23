"use client";

import { useSearchParams } from "next/navigation";
import { WfpCheckout } from "@/components/tickets/WfpCheckout";
import { track } from "@/lib/analytics";

export function TicketsCheckout({
  ticketsUrl,
  copy,
}: {
  ticketsUrl: string;
  copy: {
    title: string;
    description: string;
    iframeTitle: string;
    fallback: string;
    fallbackHint: string;
  };
}) {
  const searchParams = useSearchParams();
  const source = searchParams.get("from") ?? "direct";

  return (
    <section className="bg-uwa-black px-4 py-8 sm:px-10 sm:py-10 lg:px-16">
      <div className="mx-auto w-full max-w-[960px]">
        <h1 className="font-heading text-4xl tracking-wide text-uwa-white sm:text-6xl">
          {copy.title}
        </h1>
        <p className="mt-3 max-w-2xl text-sm leading-relaxed text-uwa-white/55">
          {copy.description}
        </p>

        <div className="mt-8 h-[min(52rem,calc(100dvh-12rem))] overflow-hidden border border-uwa-white/15 bg-white">
          <WfpCheckout
            ticketsUrl={ticketsUrl}
            source={source}
            iframeTitle={copy.iframeTitle}
          />
        </div>

        <p className="mt-4 text-sm text-uwa-white/45">
          {copy.fallbackHint}{" "}
          <a
            href={ticketsUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="text-uwa-white underline decoration-uwa-white/30 underline-offset-4 hover:text-uwa-red"
            onClick={() =>
              track("click", {
                link_url: ticketsUrl,
                link_text: copy.fallback,
                outbound: true,
                source: "tickets_page",
              })
            }
          >
            {copy.fallback}
          </a>
        </p>
      </div>
    </section>
  );
}
