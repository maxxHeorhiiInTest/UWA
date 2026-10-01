import { AdminCreateForm } from "@/components/admin/AdminCreateForm";

export default function NewWrestlerPage() {
  return (
    <div>
      <h1 className="font-heading text-3xl tracking-wide">Нова картка</h1>
      <p className="mt-2 text-sm text-uwa-white/50">
        Якщо категорію не змінити, картка потрапить до чоловічого ростера.
      </p>
      <AdminCreateForm />
    </div>
  );
}
