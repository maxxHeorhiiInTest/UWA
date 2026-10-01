import { notFound } from "next/navigation";
import {
  AdminWrestlerForm,
  DeleteWrestlerButton,
} from "@/components/admin/AdminWrestlerForm";
import { getWrestler } from "@/lib/roster-store";

export const dynamic = "force-dynamic";

export default async function EditWrestlerPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const wrestler = await getWrestler(id);
  if (!wrestler) notFound();

  return (
    <div>
      <div className="mb-8 flex flex-wrap items-start justify-between gap-4">
        <div>
          <h1 className="font-heading text-3xl tracking-wide">
            {wrestler.name.ua}
          </h1>
          <p className="mt-1 text-sm text-uwa-white/50">{wrestler.name.en}</p>
        </div>
        <DeleteWrestlerButton id={wrestler.id} name={wrestler.name.ua} />
      </div>
      <AdminWrestlerForm wrestler={wrestler} />
    </div>
  );
}
