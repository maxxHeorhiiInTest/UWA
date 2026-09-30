import { rosterCategories, type RosterCategory } from "@/config/roster";
import { getWrestlers } from "@/lib/roster-store";

export const dynamic = "force-dynamic";

const categoryLabel: Record<RosterCategory, string> = {
  men: "Чоловіки",
  women: "Жінки",
  guests: "Гості",
  teams: "Команди",
  managers: "Менеджери",
  referees: "Судді",
  alumni: "Alumni",
};

export default async function AdminRosterPage({
  searchParams,
}: {
  searchParams: Promise<{ category?: string }>;
}) {
  const { category: rawCategory } = await searchParams;
  const category =
    rawCategory &&
    (rosterCategories as readonly string[]).includes(rawCategory)
      ? (rawCategory as RosterCategory)
      : null;
  const wrestlers = await getWrestlers();
  const visible = category
    ? wrestlers.filter((wrestler) => wrestler.category === category)
    : wrestlers;

  return (
    <div>
      <div className="flex flex-wrap items-end justify-between gap-4">
        <div>
          <h1 className="font-heading text-3xl tracking-wide">Ростер</h1>
          <p className="mt-2 text-sm text-uwa-white/50">
            Додавайте картки, редагуйте біо та контент. Після збереження зміни
            одразу видно на сайті.
          </p>
        </div>
        <a
          href="/admin/new"
          className="bg-uwa-red px-5 py-2.5 text-sm font-bold uppercase tracking-wide text-uwa-white hover:bg-uwa-red-dark"
        >
          Додати картку
        </a>
      </div>

      <div className="mt-6 flex flex-wrap gap-2">
        <a
          href="/admin"
          className={`rounded-md px-3 py-1.5 text-xs uppercase tracking-wide ${
            !category
              ? "bg-uwa-red text-uwa-white"
              : "border border-uwa-panel-border text-uwa-white/70"
          }`}
        >
          Усі
        </a>
        {rosterCategories.map((key) => (
          <a
            key={key}
            href={`/admin?category=${key}`}
            className={`rounded-md px-3 py-1.5 text-xs uppercase tracking-wide ${
              category === key
                ? "bg-uwa-red text-uwa-white"
                : "border border-uwa-panel-border text-uwa-white/70"
            }`}
          >
            {categoryLabel[key]}
          </a>
        ))}
      </div>

      <ul className="mt-6 divide-y divide-uwa-panel-border border border-uwa-panel-border">
        {visible.map((wrestler) => (
          <li key={wrestler.id}>
            <a
              href={`/admin/${wrestler.id}`}
              className="flex items-center justify-between gap-4 px-4 py-3 hover:bg-uwa-panel"
            >
              <span>
                <span className="block text-sm text-uwa-white">
                  {wrestler.name.ua}
                </span>
                <span className="text-xs text-uwa-white/40">
                  {wrestler.name.en}
                </span>
              </span>
              <span className="text-[11px] uppercase tracking-wide text-uwa-white/40">
                {categoryLabel[wrestler.category]}
              </span>
            </a>
          </li>
        ))}
      </ul>
      {visible.length === 0 && (
        <p className="mt-8 text-sm text-uwa-white/40">У цій категорії порожньо.</p>
      )}
    </div>
  );
}
