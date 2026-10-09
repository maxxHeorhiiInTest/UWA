import { AdminShowForm } from "@/components/admin/AdminShowForm";
import { getSiteSettings } from "@/lib/site-settings-store";

export const dynamic = "force-dynamic";

export default async function AdminShowPage() {
  const settings = await getSiteSettings();

  return (
    <div>
      <h1 className="font-heading text-3xl tracking-wide">Поточне шоу</h1>
      <p className="mt-2 max-w-2xl text-sm text-uwa-white/50">
        Текст на головній і посилання «Квитки» прив’язані до шоу. Шоу раз на
        місяць — оновлюйте обидва поля разом.
      </p>
      <div className="mt-8">
        <AdminShowForm settings={settings} />
      </div>
    </div>
  );
}
