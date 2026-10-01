"use client";

import { useActionState, useEffect, useState } from "react";
import { useFormStatus } from "react-dom";
import { useRouter } from "next/navigation";
import { createWrestlerAction } from "@/app/admin/actions";
import { rosterCategories, type RosterCategory } from "@/config/roster";
import { AdminSaveNotice } from "@/components/admin/AdminSaveNotice";

const categoryLabel: Record<RosterCategory, string> = {
  men: "Чоловіки",
  women: "Жінки",
  guests: "Гості",
  teams: "Команди",
  managers: "Менеджери",
  referees: "Судді",
  alumni: "Alumni",
};

function CreateButton() {
  const { pending } = useFormStatus();
  return (
    <button
      type="submit"
      disabled={pending}
      className="bg-uwa-red px-6 py-3 text-sm font-bold uppercase tracking-wide text-uwa-white hover:bg-uwa-red-dark disabled:opacity-60"
    >
      {pending ? "Створення…" : "Створити"}
    </button>
  );
}

export function AdminCreateForm() {
  const router = useRouter();
  const [state, formAction] = useActionState(createWrestlerAction, undefined);
  const [open, setOpen] = useState(false);

  useEffect(() => {
    if (state) setOpen(true);
  }, [state]);

  const createdId = state && "ok" in state ? state.id : undefined;

  return (
    <form action={formAction} className="mt-8 max-w-xl space-y-4">
      <AdminSaveNotice
        open={open}
        title="Створено"
        message="Картку додано до ростера."
        error={state && "error" in state ? state.error : undefined}
        onClose={() => {
          setOpen(false);
          if (createdId) router.push(`/admin/${createdId}`);
        }}
      />
      <label className="block">
        <span className="text-xs font-medium uppercase tracking-wide text-uwa-white/50">
          Ім’я UA
        </span>
        <input
          name="nameUa"
          required
          className="mt-1.5 w-full rounded-md border border-uwa-panel-border bg-uwa-black px-3 py-2.5 text-sm outline-none focus:border-uwa-red"
        />
      </label>
      <label className="block">
        <span className="text-xs font-medium uppercase tracking-wide text-uwa-white/50">
          Ім’я EN
        </span>
        <input
          name="nameEn"
          required
          className="mt-1.5 w-full rounded-md border border-uwa-panel-border bg-uwa-black px-3 py-2.5 text-sm outline-none focus:border-uwa-red"
        />
      </label>
      <label className="block max-w-xs">
        <span className="text-xs font-medium uppercase tracking-wide text-uwa-white/50">
          Категорія
        </span>
        <select
          name="category"
          defaultValue="men"
          className="mt-1.5 w-full rounded-md border border-uwa-panel-border bg-uwa-black px-3 py-2.5 text-sm outline-none focus:border-uwa-red"
        >
          {rosterCategories.map((key) => (
            <option key={key} value={key}>
              {categoryLabel[key]}
            </option>
          ))}
        </select>
      </label>
      <CreateButton />
    </form>
  );
}
