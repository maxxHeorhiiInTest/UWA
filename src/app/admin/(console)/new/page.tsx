import { createWrestlerAction } from "../../actions";
import { rosterCategories, type RosterCategory } from "@/config/roster";

const categoryLabel: Record<RosterCategory, string> = {
  men: "Чоловіки",
  women: "Жінки",
  guests: "Гості",
  teams: "Команди",
  managers: "Менеджери",
  referees: "Судді",
  alumni: "Alumni",
};

export default function NewWrestlerPage() {
  return (
    <div>
      <h1 className="font-heading text-3xl tracking-wide">Нова картка</h1>
      <p className="mt-2 text-sm text-uwa-white/50">
        Якщо категорію не змінити, картка потрапить до чоловічого ростера.
      </p>
      <form action={createWrestlerAction} className="mt-8 max-w-xl space-y-4">
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
        <button
          type="submit"
          className="bg-uwa-red px-6 py-3 text-sm font-bold uppercase tracking-wide text-uwa-white hover:bg-uwa-red-dark"
        >
          Створити
        </button>
      </form>
    </div>
  );
}
