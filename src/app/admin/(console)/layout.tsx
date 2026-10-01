import { Logo } from "@/components/ui/Logo";
import { requireAdmin } from "@/lib/auth";
import { logoutAction } from "../actions";

export const dynamic = "force-dynamic";

export default async function AdminConsoleLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  await requireAdmin();

  return (
    <div className="flex min-h-0 flex-1 flex-col overflow-y-auto bg-uwa-black">
      <header className="sticky top-0 z-40 border-b border-uwa-panel-border bg-uwa-black">
        <div className="mx-auto flex h-14 max-w-5xl items-center justify-between px-4">
          <a href="/admin" className="flex items-center gap-3 text-uwa-red">
            <Logo className="h-7 w-auto" />
            <span className="text-xs font-bold uppercase tracking-wide text-uwa-white">
              Адмін
            </span>
          </a>
          <div className="flex items-center gap-4">
            <a
              href="/ua/roster"
              className="text-xs uppercase tracking-wide text-uwa-white/50 hover:text-uwa-white"
            >
              На сайт
            </a>
            <form action={logoutAction}>
              <button
                type="submit"
                className="text-xs uppercase tracking-wide text-uwa-white/50 hover:text-uwa-red"
              >
                Вийти
              </button>
            </form>
          </div>
        </div>
      </header>
      <div className="mx-auto w-full max-w-5xl flex-1 px-4 py-8">{children}</div>
    </div>
  );
}
