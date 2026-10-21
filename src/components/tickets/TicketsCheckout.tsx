"use client";

import { useEffect, useRef, useState } from "react";
import { useSearchParams } from "next/navigation";
import { track } from "@/lib/analytics";

const WFP_ORIGINS = [
  "https://secure.wayforpay.com",
  "https://widget.wayforpay.com",
];

const WFP_EVENTS: Record<string, string> = {
  WfpWidgetEventApproved: "payment_approved",
  WfpWidgetEventDeclined: "payment_declined",
  WfpWidgetEventPending: "payment_pending",
  WfpWidgetEventClose: "checkout_close",
};

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
  const iframeRef = useRef<HTMLIFrameElement>(null);
  const [iframeFailed, setIframeFailed] = useState(false);

  useEffect(() => {
    track("checkout_view", { source, ticketsUrl });

    const onMessage = (event: MessageEvent) => {
      if (!WFP_ORIGINS.some((origin) => event.origin.startsWith(origin))) {
        return;
      }
      const raw =
        typeof event.data === "string"
          ? event.data
          : event.data && typeof event.data === "object"
            ? String(
                (event.data as { event?: unknown }).event ??
                  (event.data as { type?: unknown }).type ??
                  ""
              )
            : "";
      const mapped = WFP_EVENTS[raw];
      track(mapped ?? "wfp_message", {
        source,
        ticketsUrl,
        wfpEvent: raw || "unknown",
      });
    };

    window.addEventListener("message", onMessage);
    return () => window.removeEventListener("message", onMessage);
  }, [source, ticketsUrl]);

  return (
    <section className="bg-uwa-black px-4 py-8 sm:px-10 sm:py-10 lg:px-16">
      <div className="mx-auto w-full max-w-[960px]">
        <h1 className="font-heading text-4xl tracking-wide text-uwa-white sm:text-6xl">
          {copy.title}
        </h1>
        <p className="mt-3 max-w-2xl text-sm leading-relaxed text-uwa-white/55">
          {copy.description}
        </p>

        <div className="mt-8 overflow-hidden border border-uwa-white/15 bg-[#111]">
          {!iframeFailed ? (
            <iframe
              ref={iframeRef}
              src={ticketsUrl}
              title={copy.iframeTitle}
              className="block h-[min(52rem,calc(100dvh-12rem))] w-full bg-black"
              allow="payment; clipboard-write"
              referrerPolicy="strict-origin-when-cross-origin"
              sandbox="allow-scripts allow-forms allow-same-origin allow-popups allow-popups-to-escape-sandbox"
              onLoad={() => track("checkout_iframe_load", { source, ticketsUrl })}
              onError={() => {
                setIframeFailed(true);
                track("checkout_iframe_error", { source, ticketsUrl });
              }}
            />
          ) : null}
        </div>

        <p className="mt-4 text-sm text-uwa-white/45">
          {copy.fallbackHint}{" "}
          <a
            href={ticketsUrl}
            target="_blank"
            rel="noopener noreferrer"
            onClick={() =>
              track("checkout_external_open", { source, ticketsUrl })
            }
            className="text-uwa-white underline decoration-uwa-white/30 underline-offset-4 hover:text-uwa-red"
          >
            {copy.fallback}
          </a>
        </p>
      </div>
    </section>
  );
}
