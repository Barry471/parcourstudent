import { deleteInfoAction, publishInfoAction } from "@/lib/actions";
import { allInfos } from "@/lib/db";

export default async function AdminInfosPage({
  searchParams,
}: {
  searchParams: Promise<{ erreur?: string }>;
}) {
  const { erreur } = await searchParams;
  const infos = allInfos();
  return (
    <div className="mx-auto max-w-3xl px-5 py-12">
      <h1 className="font-serif text-4xl">Informations</h1>
      <p className="mt-2 text-muted">Une image ou un PDF pour informer les étudiants. Eux ne peuvent pas en envoyer.</p>
      <form action={publishInfoAction} className="mt-6 grid gap-3">
        {erreur && <p className="text-sm text-amber">Fichier refusé. Utilise une image JPG, PNG, WebP ou un PDF, de moins de 4 Mo.</p>}
        <input name="title" required placeholder="Titre" className="rounded-2xl border border-line bg-card px-4 py-3" />
        <textarea name="note" placeholder="Une phrase, si besoin" className="min-h-24 rounded-2xl border border-line bg-card px-4 py-3" />
        <input name="file" required type="file" accept="image/jpeg,image/png,image/webp,application/pdf" className="text-sm" />
        <button className="rounded-full bg-blue px-5 py-3 text-paper" type="submit">Publier</button>
      </form>
      <ul className="mt-8 grid gap-3">
        {infos.map((info) => (
          <li key={info.id} className="rounded-2xl border border-line bg-card p-4">
            <p className="font-medium">{info.title}</p>
            {info.note && <p className="mt-1 text-sm text-muted">{info.note}</p>}
            <a className="mt-2 inline-block text-sm text-blue underline" href={`/infos/${info.id}`}>Ouvrir</a>
            <form action={deleteInfoAction} className="mt-2">
              <input type="hidden" name="id" value={info.id} />
              <button className="text-sm text-amber" type="submit">Retirer</button>
            </form>
          </li>
        ))}
      </ul>
    </div>
  );
}
