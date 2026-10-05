import Link from "next/link";
import { requireUser } from "@/lib/guard";
import { searchContent } from "@/lib/search";

export default async function RecherchePage({ searchParams }: { searchParams: Promise<{ q?: string }> }) {
  await requireUser();
  const { q } = await searchParams;
  const query = q ?? "";
  const hits = searchContent(query);
  return (
    <div className="mx-auto max-w-3xl px-5 py-12">
      <p className="text-sm uppercase tracking-[0.16em] text-blue">Recherche</p>
      <h1 className="mt-2 font-serif text-4xl">Trouver une démarche</h1>
      <form className="mt-6 flex gap-2" action="/recherche">
        <input name="q" defaultValue={query} placeholder="Visale, CVEC, visa, logement…" className="w-full rounded-2xl border border-line px-4 py-3" />
        <button className="rounded-full bg-blue px-5 py-3 text-paper" type="submit">Chercher</button>
      </form>
      {query.trim().length >= 2 && hits.length === 0 && <p className="mt-6 text-muted">Rien sous ce mot. Essaie un mot du menu, comme logement ou visa.</p>}
      <ul className="mt-6 grid gap-3">
        {hits.map((hit) => (
          <li key={hit.href + hit.title}>
            <Link href={hit.href} className="block rounded-2xl border border-line bg-card px-4 py-3 hover:border-blue">
              <span className="font-medium">{hit.title}</span>
              <span className="mt-1 block text-sm text-muted">{hit.text}</span>
            </Link>
          </li>
        ))}
      </ul>
    </div>
  );
}
