"use client";

import { useEffect, useRef, useState } from "react";
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

export function WfpCheckout({
  ticketsUrl,
  source,
  iframeTitle,
  onWidgetClose,
}: {
  ticketsUrl: string;
  source: string;
  iframeTitle: string;
  onWidgetClose?: () => void;
}) {
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
      if (mapped === "checkout_close") onWidgetClose?.();
    };

    window.addEventListener("message", onMessage);
    return () => window.removeEventListener("message", onMessage);
  }, [onWidgetClose, source, ticketsUrl]);

  if (iframeFailed) return null;

  return (
    <iframe
      ref={iframeRef}
      src={ticketsUrl}
      title={iframeTitle}
      className="block h-full w-full bg-white"
      allow="payment; clipboard-write"
      referrerPolicy="strict-origin-when-cross-origin"
      sandbox="allow-scripts allow-forms allow-same-origin allow-popups allow-popups-to-escape-sandbox"
      onLoad={() => track("checkout_iframe_load", { source, ticketsUrl })}
      onError={() => {
        setIframeFailed(true);
        track("checkout_iframe_error", { source, ticketsUrl });
      }}
    />
  );
}
