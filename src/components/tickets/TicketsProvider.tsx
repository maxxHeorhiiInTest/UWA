"use client";

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from "react";
import { WfpCheckout } from "@/components/tickets/WfpCheckout";
import { track } from "@/lib/analytics";

export type TicketsCopy = {
  title: string;
  iframeTitle: string;
  close: string;
  fallback: string;
  fallbackHint: string;
};

type TicketsContextValue = {
  open: (source: string) => void;
  close: () => void;
};

const TicketsContext = createContext<TicketsContextValue | null>(null);

export function useTickets() {
  const value = useContext(TicketsContext);
  if (!value) {
    throw new Error("useTickets must be used within TicketsProvider");
  }
  return value;
}

export function TicketsProvider({
  ticketsUrl,
  copy,
  children,
}: {
  ticketsUrl: string;
  copy: TicketsCopy;
  children: ReactNode;
}) {
  const [source, setSource] = useState<string | null>(null);
  const isOpen = source !== null;

  const open = useCallback((nextSource: string) => {
    setSource(nextSource);
  }, []);

  const close = useCallback(() => {
    setSource(null);
  }, []);

  useEffect(() => {
    if (!isOpen) return;
    const previous = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    const onKey = (event: KeyboardEvent) => {
      if (event.key === "Escape") close();
    };
    window.addEventListener("keydown", onKey);
    return () => {
      document.body.style.overflow = previous;
      window.removeEventListener("keydown", onKey);
    };
  }, [close, isOpen]);

  const value = useMemo(() => ({ open, close }), [close, open]);

  return (
    <TicketsContext.Provider value={value}>
      {children}
      {isOpen && source ? (
        <div className="fixed inset-0 z-[80] flex items-center justify-center p-3 sm:p-6">
          <button
            type="button"
            aria-label={copy.close}
            onClick={close}
            className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,rgba(40,0,12,0.12)_0%,rgba(0,0,0,0.42)_58%,rgba(0,0,0,0.58)_100%)] backdrop-blur-[3px]"
          />
          <div
            role="dialog"
            aria-modal="true"
            aria-labelledby="tickets-dialog-title"
            className="relative z-10 flex h-[min(88dvh,50rem)] w-full max-w-[62rem] flex-col overflow-hidden rounded-sm bg-uwa-black shadow-[inset_0_1px_0_rgba(255,255,255,0.22),inset_0_-2px_0_rgba(0,0,0,0.7),inset_1px_0_0_rgba(255,255,255,0.08),inset_-1px_0_0_rgba(0,0,0,0.45),0_2px_0_rgba(255,255,255,0.06),0_28px_90px_rgba(0,0,0,0.75),0_0_0_1px_rgba(214,0,61,0.45),0_0_56px_rgba(214,0,61,0.22)] ring-1 ring-white/20"
          >
            <div className="flex items-center justify-between gap-4 border-b border-white/10 bg-gradient-to-b from-white/[0.06] to-transparent px-4 py-3 sm:px-5">
              <h2
                id="tickets-dialog-title"
                className="font-heading text-2xl tracking-wide text-uwa-white sm:text-4xl"
              >
                {copy.title}
              </h2>
              <button
                type="button"
                onClick={close}
                className="flex h-10 w-10 shrink-0 items-center justify-center rounded-sm border border-white/15 bg-black/40 text-3xl leading-none text-uwa-white/75 shadow-[inset_0_1px_0_rgba(255,255,255,0.16)] transition-colors hover:border-white/40 hover:text-uwa-white"
                aria-label={copy.close}
              >
                ×
              </button>
            </div>
            <div className="min-h-0 flex-1 bg-[#111] p-px">
              <div className="h-full overflow-hidden bg-white">
                <WfpCheckout
                  ticketsUrl={ticketsUrl}
                  source={source}
                  iframeTitle={copy.iframeTitle}
                  onWidgetClose={close}
                />
              </div>
            </div>
            <p className="border-t border-white/10 px-4 py-2.5 text-xs text-uwa-white/45 sm:px-5">
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
                    source: "tickets_dialog",
                  })
                }
              >
                {copy.fallback}
              </a>
            </p>
          </div>
        </div>
      ) : null}
    </TicketsContext.Provider>
  );
}

export function TicketsTrigger({
  source,
  className,
  children,
  onClick,
}: {
  source: string;
  className?: string;
  children: ReactNode;
  onClick?: () => void;
}) {
  const { open } = useTickets();
  return (
    <button
      type="button"
      onClick={() => {
        open(source);
        onClick?.();
      }}
      className={className}
    >
      {children}
    </button>
  );
}
