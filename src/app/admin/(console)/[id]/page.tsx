import { notFound } from "next/navigation";
import {
  AdminWrestlerForm,
  DeleteWrestlerButton,
} from "@/components/admin/AdminWrestlerForm";
import { getWrestler } from "@/lib/roster-store";

export const dynamic = "force-dynamic";

export default async function EditWrestlerPage({
  params,
  searchParams,
}: {
  params: Promise<{ id: string }>;
  searchParams: Promise<{ saved?: string }>;
}) {
  const { id } = await params;
  const { saved } = await searchParams;
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
      {saved ? (
        <p className="mb-6 text-sm text-uwa-white/70">Збережено.</p>
      ) : null}
      <AdminWrestlerForm key={`${wrestler.id}-${wrestler.category}`} wrestler={wrestler} />
    </div>
  );
}
