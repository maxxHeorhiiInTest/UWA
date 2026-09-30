"use client";

import { useActionState } from "react";
import { loginAction } from "../actions";

export function LoginForm() {
  const [state, action, pending] = useActionState(loginAction, undefined);

  return (
    <form action={action} className="mt-8 space-y-4">
      <label className="block">
        <span className="text-xs font-medium uppercase tracking-wide text-uwa-white/50">
          Логін
        </span>
        <input
          name="username"
          autoComplete="username"
          required
          className="mt-1.5 w-full rounded-md border border-uwa-panel-border bg-uwa-black px-3 py-2.5 text-sm text-uwa-white outline-none focus:border-uwa-red"
        />
      </label>
      <label className="block">
        <span className="text-xs font-medium uppercase tracking-wide text-uwa-white/50">
          Пароль
        </span>
        <input
          name="password"
          type="password"
          autoComplete="current-password"
          required
          className="mt-1.5 w-full rounded-md border border-uwa-panel-border bg-uwa-black px-3 py-2.5 text-sm text-uwa-white outline-none focus:border-uwa-red"
        />
      </label>
      {state?.error && (
        <p className="text-sm text-uwa-red">{state.error}</p>
      )}
      <button
        type="submit"
        disabled={pending}
        className="w-full bg-uwa-red px-5 py-3 text-sm font-bold uppercase tracking-wide text-uwa-white hover:bg-uwa-red-dark disabled:opacity-60"
      >
        {pending ? "Вхід…" : "Увійти"}
      </button>
    </form>
  );
}
