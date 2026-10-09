"use client";

import { useActionState, useEffect, useState } from "react";
import { useFormStatus } from "react-dom";
import { saveShowAction } from "@/app/admin/actions";
import { AdminSaveNotice } from "@/components/admin/AdminSaveNotice";
import type { SiteSettings } from "@/config/site-settings";

function SaveButton() {
  const { pending } = useFormStatus();
  return (
    <button
      type="submit"
      disabled={pending}
      className="bg-uwa-red px-6 py-3 text-sm font-bold uppercase tracking-wide text-uwa-white hover:bg-uwa-red-dark disabled:opacity-60"
    >
      {pending ? "Збереження…" : "Зберегти"}
    </button>
  );
}

export function AdminShowForm({ settings }: { settings: SiteSettings }) {
  const [state, formAction] = useActionState(saveShowAction, undefined);
  const [notice, setNotice] = useState<"ok" | "error" | null>(null);

  useEffect(() => {
    if (state && "ok" in state && state.ok) setNotice("ok");
    else if (state && "error" in state && state.error) setNotice("error");
  }, [state]);

  return (
    <form action={formAction} className="max-w-2xl space-y-6">
      <AdminSaveNotice
        open={notice !== null}
        title="Збережено"
        message="Посилання на квитки і текст головної оновлено."
        error={
          notice === "error" && state && "error" in state
            ? state.error
            : undefined
        }
        onClose={() => setNotice(null)}
      />

      <label className="block">
        <span className="text-xs font-medium uppercase tracking-wide text-uwa-white/50">
          Посилання на квитки
        </span>
        <input
          name="ticketsUrl"
          type="url"
          required
          defaultValue={settings.ticketsUrl}
          placeholder="https://secure.wayforpay.com/…"
          className="mt-1.5 w-full rounded-md border border-uwa-panel-border bg-uwa-black px-3 py-2.5 text-sm outline-none focus:border-uwa-red"
        />
      </label>

      <fieldset className="space-y-3">
        <legend className="text-xs font-bold uppercase tracking-wide text-uwa-white/60">
          Текст на головній
        </legend>
        <label className="block">
          <span className="text-xs font-medium uppercase tracking-wide text-uwa-white/50">
            UA
          </span>
          <textarea
            name="subtitleUa"
            required
            rows={4}
            defaultValue={settings.subtitle.ua}
            className="mt-1.5 w-full rounded-md border border-uwa-panel-border bg-uwa-black px-3 py-2.5 text-sm outline-none focus:border-uwa-red"
          />
        </label>
        <label className="block">
          <span className="text-xs font-medium uppercase tracking-wide text-uwa-white/50">
            EN
          </span>
          <textarea
            name="subtitleEn"
            required
            rows={4}
            defaultValue={settings.subtitle.en}
            className="mt-1.5 w-full rounded-md border border-uwa-panel-border bg-uwa-black px-3 py-2.5 text-sm outline-none focus:border-uwa-red"
          />
        </label>
      </fieldset>

      <SaveButton />
    </form>
  );
}
